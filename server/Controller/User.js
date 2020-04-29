const UserModel = require("../Model/User");
const jwt = require("jsonwebtoken");
const config = require("../config.json");
const users = new UserModel();
const { sendEmailUser } = require("../Controller/UserEmail");

exports.userRegister = async (req, res, next) => {
  try {
    console.log(req.body);
    let userCheck = await users.getUserByEmail(req.body.email);

    if (userCheck.length === 0) {
      let password = require("crypto").randomBytes(4).toString("hex");
      await users.createUser(
        req.body.email,
        password,
        req.body.firstname,
        req.body.lastname,
        req.body.phonenumber
      );
      const role = await users.assignRole(req.body.email);
      console.log(role)
      await sendEmailUser(req.body.email, password);
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
    let userLogin;

    userLogin = await users.getLogin(req.body);
    userRole = await users.getUserRole(req.body.userId);
    let role = [];
    for (let i = 0; i < userRole.length; i++) {
      role.push(userRole[i].roleId);
    }
    let adminlist = [1, 2, 3];

    let op = role.every((element) => adminlist.indexOf(element) > -1);

    if (userLogin.length > 0) {
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
    const userPassword = await users.getPassword(
      res.locals.authData.user[0].userId
    );
    console.log(userPassword[0].password === req.body.password);
    console.log(req.body.password);
    if (userPassword[0].password === req.body.password) {
      console.log("check");
      const userPass = await users.changePassword(res.locals.authData.user[0].userId, req.body.newPassword);
      console.log(userPass);
      res.status(200).json({ result: "success" });
    } else {
      console.log("not check");
      res.status(500).json({ result: "false", msg: "password not correct" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: "false", msg: err });
  }
};
