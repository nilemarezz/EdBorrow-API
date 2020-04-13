const UserModel = require("../Model/User");
const jwt = require("jsonwebtoken");
const config = require("../config.json");

const users = new UserModel();

exports.userLogin = async (req, res, next) => {
  try {
    let userLogin;
    userLogin = await users.getLogin(req.body);

    if (userLogin.length > 0) {
      jwt.sign(
        { user: userLogin },
        config.ACCESS_TOKEN_SECRET,
        (err, accessToken) => {
          console.log("Tokrn" + accessToken);
          res.status(200).json({
            result: "success",
            accessToken,
            user: userLogin[0].firstName,
          });
        }
      );
    } else {
      res.status(403).json({ result: "false", msg: "Invalid user id" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: "false", msg: err });
  }
};

exports.getUserDetail = async (req, res, next) => {
  try {
    let userDetails;
    
    userDetails = await users.getUserDetails(res.locals.authData.user[0].userId);
    console.log(userDetails)
    res.status(200).json({ result: "success", data: userDetails });
  } catch (err) {
    res.status(500).json({ result: "false", msg: err });
  }
};
