const UserModel = require('../Model/User');
const { actionLogs } = require(`../Model/Data`);
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const config = require('../config.json');
const users = new UserModel();
const { sendEmailUser } = require('../Utilities/EmailService/RegisterEmail');
const printlog = require('../config/logColor');
const { checkUserRole } = require('../Utilities/checkUserRole')

exports.userRegister = async (req, res, next) => {
  try {
    let userCheck = await users.getUserById(req.body.email);
    if (userCheck.length === 0) {
      let password = require('crypto').randomBytes(4).toString('hex');
      await sendEmailUser(req.body.email, password);
      var cipherPassword = CryptoJS.AES
        .encrypt(password, config.CRYPTO_SECRET_KEY)
        .toString();
      await users.createUser(
        req.body.email,
        cipherPassword,
        req.body.firstname,
        req.body.lastname,
        req.body.phonenumber,
        req.body.advisor
      );

      const role = await users.assignRole(req.body.email, 10);
      printlog('Green', `Register Success : ${req.body.email}`);
      res.status(200).json({
        result: 'success',
        msg: 'Register success. Please check your email to see your password.',
      });
    } else {
      printlog('Red', `Register Failed : ${req.body.email}`);

      res.status(200).json({ result: 'false', msg: 'Email is already.' });
    }
  } catch (err) {
    printlog('Red', err);
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.userAuthSSO = async (req, res, next) => {
  try {
    let userLogin, userRole;
    userLogin = await users.getLogin(req.body.user_id);
    const name = req.body.name_en.split(" ");
    if (userLogin.length === 0) {
      await users.createUser(
        req.body.user_id,
        req.body.email,
        name[0],
        name[1],
      );
      let userRole;
      if (req.body.user_type === "st_group") {
        userRole = { id: 10, role: [{ roleId: 10 }] }
      } else {
        userRole = { id: 20, role: [{ roleId: 20 }] }
      }
      await users.assignRole(req.body.user_id, userRole.id);
      let role = await checkUserRole(userRole.role)
      jwt.sign(
        { user: userLogin },
        config.ACCESS_TOKEN_SECRET,
        (err, accessToken) => {
          res.status(200).json({
            result: 'success',
            accessToken,
            user: name[0],
            ...role
          });
        }
      );
    } else {
      let userRole = await users.getUserRole(req.body.user_id);
      console.log(userLogin)
      let role = await checkUserRole(userRole)
      jwt.sign(
        { user: userLogin },
        config.ACCESS_TOKEN_SECRET,
        (err, accessToken) => {
          res.status(200).json({
            result: 'success',
            accessToken,
            user: name[0],
            ...role
          });
        }
      );
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: false })
  }
}

exports.userLogin = async (req, res, next) => {
  try {
    let userLogin, userRole;
    console.log(req.body)
    userLogin = await users.getLogin(req.body.username);
    console.log(userLogin)
    var bytes = CryptoJS.AES.decrypt(
      userLogin[0].password,
      config.CRYPTO_SECRET_KEY
    );
    var passwordDecrypt = bytes.toString(CryptoJS.enc.Utf8);

    if (passwordDecrypt === req.body.password) {
      let userRole = await users.getUserRole(req.body.username);
      let role = await checkUserRole(userRole)
      if (role.student === true) {
        res
          .status(403)
          .json({ result: 'false', msg: 'Invalid user id or password' });
        printlog('Red', `Login Fail : ${req.body.username} - not student login with admon method`);
        return
      }
      printlog('Green', `Login Success : ${req.body.username}`);
      jwt.sign(
        { user: userLogin },
        config.ACCESS_TOKEN_SECRET,
        (err, accessToken) => {
          res.status(200).json({
            result: 'success',
            accessToken,
            user: userLogin[0].firstName,
            ...role
          });
        }
      );
    } else {
      printlog('Red', `Login Fail : ${req.body.username} `);
      res
        .status(403)
        .json({ result: 'false', msg: 'Invalid user id or password' });
    }
  } catch (err) {
    printlog('Red', `Login Fail: ${req.body.username} `);
    console.log(err);
    res
      .status(403)
      .json({ result: 'false', msg: 'Invalid user id or password' });
  }
};

exports.getUserDetail = async (req, res, next) => {
  try {
    let userDetails;

    userDetails = await users.getUserDetails(
      res.locals.authData.user[0].userId
    );
    let userRole = await users.getUserRole(res.locals.authData.user[0].userId);
    let role = await checkUserRole(userRole)
    res.status(200).json({ result: 'success', data: { ...userDetails[0], ...role } });
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.getUserRole = async id => {
  try {
    let userRole;

    userRole = await users.getUserRole(id);
    let role = [];
    for (let i = 0; i < userRole.length; i++) {
      role.push(userRole[i].roleId);
    }

    return role;
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.ChangePassword = async (req, res, next) => {
  try {
    const userPassword = await users.getPassword(
      res.locals.authData.user[0].userId
    );

    var bytes = CryptoJS.AES.decrypt(
      userPassword[0].password,
      config.CRYPTO_SECRET_KEY
    );
    var passwordDecrypt = bytes.toString(CryptoJS.enc.Utf8);

    if (passwordDecrypt === req.body.password) {
      var cipherPassword = CryptoJS.AES
        .encrypt(req.body.newPassword, config.CRYPTO_SECRET_KEY)
        .toString();
      await users.changePassword(
        res.locals.authData.user[0].userId,
        cipherPassword
      );
      printlog(
        'Green',
        `Change Password Success: ${res.locals.authData.user[0].userId} `
      );
      await actionLogs.CHANGE_PASSWORD_LOG(res.locals.authData.user[0].userId, true, 'Success');
      await req.app.io.sockets.emit('updateLogs', "");
      await res
        .status(200)
        .json({ result: 'success', msg: 'Change password success.' });
    } else {
      printlog(
        'Red',
        `Change Password Fail: ${res.locals.authData.user[0].userId} `
      );
      await actionLogs.CHANGE_PASSWORD_LOG(res.locals.authData.user[0].userId, false, 'password not correct');
      await req.app.io.sockets.emit('updateLogs', "");
      res.status(403).json({ result: 'false', msg: 'password not correct' });
    }
  } catch (err) {
    printlog(
      'Red',
      `Change Password Fail: ${res.locals.authData.user[0].userId} `
    );
    console.log(err);
    await actionLogs.CHANGE_PASSWORD_LOG(res.locals.authData.user[0].userId, false, err);
    await req.app.io.sockets.emit('updateLogs', "");
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.GetAdvisorList = async (req, res, next) => {
  try {
    const advisorList = await users.getAdvisorList()
    res.status(200).json({ result: "success", data: advisorList });
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: "false", msg: err });
  }
}


exports.GetUserList = async (req, res, next) => {
  try {
    const role = await users.getUserRole(res.locals.authData.user[0].userId)
    const userRole = await checkUserRole(role)
    if (userRole.admin === true) {
      const userList = await users.getUserList()
      res.status(200).json({ result: "success", data: userList });
    } else {
      res.status(500).json({ result: "false", msg: err });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: "false", msg: err });
  }
}

exports.DeleteUser = async (req, res, next) => {
  try {
    const role = await users.getUserRole(res.locals.authData.user[0].userId)
    const userRole = await checkUserRole(role)
    if (userRole.admin === true) {
      await users.deleteUserRole(req.query.userId)
      await users.deleteUser(req.query.userId)
      printlog(
        'Green',
        `Delete User Success: ${req.query.userId} `
      );
      await actionLogs.DELETE_USER_LOG(res.locals.authData.user[0].userId, true, `id: ${req.query.userId} `);
      await req.app.io.sockets.emit('updateLogs', "");
      res.status(200).json({ result: "success", data: req.query.userId });
    } else {
      await actionLogs.DELETE_USER_LOG(res.locals.authData.user[0].userId, false, "Access Deny");
      res.status(500).json({ result: "false", msg: err });
    }
  } catch (err) {
    console.log(err)
    await actionLogs.DELETE_USER_LOG(res.locals.authData.user[0].userId, false, err);
    await req.app.io.sockets.emit('updateLogs', "");
    res.status(500).json({ result: "false", msg: err });
  }
}

exports.CreateUser = async (req, res, next) => {
  try {
    const role = await users.getUserRole(res.locals.authData.user[0].userId)
    const userRole = await checkUserRole(role)
    if (userRole.admin === true) {
      var cipherPassword = CryptoJS.AES.encrypt(req.body.password, config.CRYPTO_SECRET_KEY).toString();
      req.body.password = cipherPassword
      await users.AddUser(req.body)
      await users.assignRole(req.body.userId, req.body.role)

      printlog(
        'Green',
        `Add User Success: ${req.body.userId} `
      );
      res.status(200).json({ result: "success" });
    }

  } catch (err) {
    console.log(err)
    await actionLogs.CREATE_USER_LOG(res.locals.authData.user[0].userId, false, 'null value');
    await req.app.io.sockets.emit('updateLogs', "");
    printlog(
      'Red',
      `Create User Fail: ${req.body.userId} `
    );
    res.status(500).json({ result: "false", msg: err });
  }
}