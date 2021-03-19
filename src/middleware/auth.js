const jwt = require("jsonwebtoken");
const User = require("../models/users");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    const token = authHeader.replace("Bearer ", "");
    const tokenDecoded = jwt.verify(token, "TerveTerveTerva");

    const user = await User.findOne({
      _id: tokenDecoded.id,
      "tokens.token": token,
    });

    if (!user) throw new Error();

    req.token = token;
    req.user = user;

    next();
  } catch (e) {
    res.status(401).send({ error: "Authorization failed" });
  }
};

module.exports = auth;
