const CryptoJS = require('crypto-js');
const config = require('../config.json');
const { addAdmin, addItemDepartment, addUserDepartment, getItems, getDepartment, deleteDepartment, deleteUser } = require('../Model/Admin')
const { actionLogs } = require('../Model/Data');
const pool = require('../config/BorrowSystemDB');
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
      await actionLogs.ADD_DEPARTMENT_LOG(res.locals.authData.user[0].userId, true, null);
      res.status(200).json({ result: 'success', });
    } else {
      await actionLogs.ADD_DEPARTMENT_LOG(res.locals.authData.user[0].userId, false, 'Permission deny');
      res.status(500).json({ result: 'false', msg: 'Permission deny' });

    }

  } catch (err) {
    printlog(
      'Red',
      `Add Department Fail`
    );
    console.log(err);
    await actionLogs.ADD_DEPARTMENT_LOG(res.locals.authData.user[0].userId, false, err.code);
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.getItemsSysytemAdmin = async (req, res, next) => {
  try {
    const role = await user.getUserRole(res.locals.authData.user[0].userId)
    const userRole = await checkUserRole(role)
    if (userRole.admin === true) {
      const items = await getItems()
      res.status(200).json({ result: 'success', data: items });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: 'false', msg: err });
  }
}


exports.getdepartmentList = async (req, res, next) => {
  try {
    const role = await user.getUserRole(res.locals.authData.user[0].userId)
    const userRole = await checkUserRole(role)
    if (userRole.admin === true) {
      const department = await getDepartment()
      res.status(200).json({ result: 'success', data: department });
    } else {
      res.status(500).json({ result: 'false', msg: 'Permission Deny' });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: 'false', msg: err });
  }
}

exports.deleteDepartment = async (req, res, next) => {
  try {
    const role = await user.getUserRole(res.locals.authData.user[0].userId)
    const userRole = await checkUserRole(role)
    if (userRole.admin === true) {
      await deleteDepartment(req.body.departmentId)
      await deleteUser(req.body.userId, req.body.departmentId)
      await actionLogs.DELETE_DEPARTMENT_LOG(res.locals.authData.user[0].userId, true, req.body.departmentId);
      res.status(200).json({ result: 'success' });
    } else {
      res.status(500).json({ result: 'false', msg: 'Permission Deny' });
    }
  } catch (err) {
    console.log(err)
    await actionLogs.DELETE_DEPARTMENT_LOG(res.locals.authData.user[0].userId, false, err.code);
    res.status(500).json({ result: 'false', msg: err });
  }
}