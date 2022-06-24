const jwt = require('jsonwebtoken');
const userDB = require('./models/user');

const middleware = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(409).send("authentication required");
    try {
        const token = authHeader.split(' ')[1]
        try {
            const alive = jwt.verify(token, 'secret');
        } catch (err) {
            return res.status(403).send("authentication required");
        }
        const username = jwt.decode(token).username;
        const user = await userDB.findOne({ username });
        if (user.username !== username || user.token !== token) return res.status(403).send("authentication required");
        const newToken = jwt.sign({
            username,
            role: 'user'
        }, 'secret', {
            expiresIn: '1h'
        });
        await userDB.updateOne({ username }, { token: newToken });
        req.token = newToken;
        next();
    } catch (err) {
        console.error(err);
    }
}

module.exports = middleware;