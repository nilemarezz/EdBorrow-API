const UserModel = require("../Model/User");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const config = require("../config.json");
const users = new UserModel();
const { sendEmailUser } = require("../Controller/UserEmail");

exports.userRegister = async (req, res, next) => {
  try {
    console.log(req.body);
    let userCheck = await users.getUserByEmail(req.body.email);

    if (userCheck.length === 0) {
      let password = require("crypto").randomBytes(4).toString("hex");
      await sendEmailUser(req.body.email, password);
      var cipherPassword = CryptoJS.AES.encrypt(password, config.CRYPTO_SECRET_KEY).toString();
      await users.createUser(
        req.body.email,
        cipherPassword,
        req.body.firstname,
        req.body.lastname,
        req.body.phonenumber
      );
      
      const role = await users.assignRole(req.body.email);
      console.log(role)

      res.status(200).json({
        result: "success",
        msg: "Register success. Please check your email to see your password.",
      });
    } else {
      res.status(200).json({ result: "false", msg: "Email is already." });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: "false", msg: err });
  }
};

exports.userLogin = async (req, res, next) => {
  try {
    let userLogin, userRole;
    userLogin = await users.getLogin(req.body.userId);

    //get password in database to decrypt
    var bytes  = CryptoJS.AES.decrypt(userLogin[0].password, config.CRYPTO_SECRET_KEY);
    var passwordDecrypt = bytes.toString(CryptoJS.enc.Utf8);

    let role = [];

    if (passwordDecrypt === req.body.password) {
      userRole = await users.getUserRole(req.body.userId);
      for (let i = 0; i < userRole.length; i++) {
        role.push(userRole[i].roleId);
      }
      let adminlist = [1, 2, 3];
  
      let op = role.every((element) => adminlist.indexOf(element) > -1);

      jwt.sign(
        { user: userLogin },
        config.ACCESS_TOKEN_SECRET,
        (err, accessToken) => {
          res.status(200).json({
            result: "success",
            accessToken,
            user: userLogin[0].firstName,
            admin: op,
          });
        }
      );
    } else {
      res.status(403).json({ result: "false", msg: "Invalid user id or password" });
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({ result: "false", msg: "Invalid user id or password" });
  }
};

exports.getUserDetail = async (req, res, next) => {
  try {
    let userDetails;

    userDetails = await users.getUserDetails(
      res.locals.authData.user[0].userId
    );
    userRole = await users.getUserRole(res.locals.authData.user[0].userId);
    let role = [];
    for (let i = 0; i < userRole.length; i++) {
      role.push(userRole[i].roleId);
    }
    let adminlist = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    let op = role.every((element) => adminlist.indexOf(element) > -1);

    res
      .status(200)
      .json({ result: "success", data: { ...userDetails[0], admin: op } });
  } catch (err) {
    res.status(500).json({ result: "false", msg: err });
  }
};

exports.getUserRole = async (id) => {
  try {
    let userRole;

    userRole = await users.getUserRole(id);
    let role = [];
    for (let i = 0; i < userRole.length; i++) {
      role.push(userRole[i].roleId);
    }

    return role;
  } catch (err) {
    res.status(500).json({ result: "false", msg: err });
  }
};

exports.ChangePassword = async (req, res, next) => {
  try {
    const userPassword = await users.getPassword(res.locals.authData.user[0].userId);

    var bytes  = CryptoJS.AES.decrypt(userPassword[0].password, config.CRYPTO_SECRET_KEY);
    var passwordDecrypt = bytes.toString(CryptoJS.enc.Utf8);

    if (passwordDecrypt === req.body.password) {
      console.log("check");
      var cipherPassword = CryptoJS.AES.encrypt(req.body.newPassword, config.CRYPTO_SECRET_KEY).toString();
      const userPass = await users.changePassword(res.locals.authData.user[0].userId, cipherPassword);
      console.log(userPass);
      res.status(200).json({ result: "success", msg: "Change password success."});
    } else {
      console.log("not check");
      res.status(403).json({ result: "false", msg: "password not correct" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: "false", msg: err });
  }
};
