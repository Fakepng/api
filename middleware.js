const jwt = require('jsonwebtoken');
const userDB = require('./models/user');
const RSA_PRIVATE_KEY = process.env.RSA_PRIVATE_KEY.replace(/\\n/g, '\n');
const RSA_PUBLIC_KEY = process.env.RSA_PUBLIC_KEY.replace(/\\n/g, '\n');

const middleware = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(409).send("authentication required");
    try {
        const token = authHeader.split(' ')[1]
        try {
            const alive = jwt.verify(token, RSA_PUBLIC_KEY);
        } catch (err) {
            return res.status(403).send("authentication required");
        }
        const username = jwt.decode(token).username;
        const user = await userDB.findOne({ username });
        if (user.username !== username || user.token !== token) return res.status(403).send("authentication required");
        const newToken = jwt.sign({
            username,
            role: 'user'
        }, RSA_PRIVATE_KEY, {
            algorithm: "RS256",
            issuer: "Fakepng",
            expiresIn: '1h'
        });
        await userDB.updateOne({ username }, { token: newToken });
        req.username = username;
        req.token = newToken;
        next();
    } catch (err) {
        console.error(err);
    }
}

module.exports = middleware;