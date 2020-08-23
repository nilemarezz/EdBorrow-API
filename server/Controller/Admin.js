const CryptoJS = require('crypto-js');
const config = require('../config.json')
const pool = require('../config/BorrowSystemDB');
const { addAdmin, addItemDepartment, addUserDepartment } = require('../Model/Admin')
const printlog = require('../config/logColor');
const UserModel = require('../Model/User');
const { checkUserRole } = require('../Utilities/checkUserRole')
const user = new UserModel()
exports.addAdmin = async (req, res, next) => {
  try {
    var cipherPassword = CryptoJS.AES
      .encrypt(req.body.password, config.CRYPTO_SECRET_KEY)
      .toString();
    await addAdmin(req.body.userId, req.body.firstname, req.body.lastname, cipherPassword)
    res.status(200).json({ result: 'success', msg: 'Add Admin Success' });
  } catch (err) {
    printlog(
      'Red',
      `Add Admin Fail`
    );
    console.log(err);
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.addDepartment = async (req, res, next) => {
  try {
    const { userId, firstName, lastName, password, departmentName, departmentTelNo, departmentEmail,
      placeBuilding, placeFloor, placeRoom
    } = req.body
    const role = await user.getUserRole(res.locals.authData.user[0].userId)
    const userRole = await checkUserRole(role)
    if (userRole.admin === true) {
      var cipherPassword = CryptoJS.AES
        .encrypt(password, config.CRYPTO_SECRET_KEY)
        .toString();

      const addDepartment = await addItemDepartment(departmentName, departmentTelNo, departmentEmail, placeBuilding, placeFloor, placeRoom)
      await addUserDepartment(userId, firstName, lastName, cipherPassword, addDepartment)
      res.status(500).json({ result: 'success', msg: 'Add Department success' });

    } else {
      res.status(500).json({ result: 'false', msg: 'Permission deny' });
    }

  } catch (err) {
    printlog(
      'Red',
      `Add Admin Fail`
    );
    console.log(err);
    res.status(500).json({ result: 'false', msg: err });
  }
};