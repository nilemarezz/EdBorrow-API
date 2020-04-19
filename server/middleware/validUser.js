const jwt = require("jsonwebtoken");
const config = require("../config.json");
module.exports = function validUser(req, res, next) {
  jwt.verify(
    req.accessToken,
    config.ACCESS_TOKEN_SECRET,
    async (err, authData) => {
      if (err) {
        res.status(403).json({ result: "false", msg: "Invalid access token" });
      } else {
        res.locals.authData = authData;
        console.log(authData)
        next();
      }
    }
  );
};
