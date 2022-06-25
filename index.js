require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const userDB = require("./models/user");
const app = express();
const middleware = require("./middleware");

const PORT = process.env.PORT || 5050;
const CLIENT = process.env.CLIENT || "*";
const DATABASE = process.env.DATABASE;
const RSA_PRIVATE_KEY = process.env.RSA_PRIVATE_KEY.replace(/\\n/g, '\n');
const RSA_PUBLIC_KEY = process.env.RSA_PUBLIC_KEY.replace(/\\n/g, '\n');

const corsOptions = {
  origin: CLIENT,
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

(async () => {
  try {
    await mongoose.connect(DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB 💽");
  } catch (error) {
    console.log(error);
  }
})();

app.get("/", (req, res) => {
  res.json({
    message: "welecome to fakepng api backend",
    contact: "contact@fakepng.com",
  });
});

app.post("/create", async (req, res) => {
  try {
    const { username } = req.body;
    const oldUser = userDB.findOne({ username });
    if (oldUser.username === username)
      return res.status(409).send("User already exists");
    const token = jwt.sign(
      {
        username,
        role: "user",
      },
      RSA_PRIVATE_KEY,
      {
        algorithm: "RS256",
        issuer: "Fakepng",
        expiresIn: "1h",
      }
    );
    await userDB.create({ username, token });
    return res.json({ token });
  } catch (err) {
    console.error(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username } = req.body;
    const token = jwt.sign(
      {
        username,
        role: "user",
      },
      RSA_PRIVATE_KEY,
      {
        algorithm: "RS256",
        issuer: "Fakepng",
        expiresIn: "1h",
      }
    );
    await userDB.updateOne({ username }, { token });
    res.json({ token });
  } catch (err) {
    console.error(err);
  }
});

app.get("/api", middleware, async (req, res) => {
  res.json({ message: `Welcome ${req.username}`, token: req.token });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});