const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')
const { addAdmin, addDepartment, getItemsSysytemAdmin, getdepartmentList } = require('../Controller/Admin')
router
  .route("/addAdmin")
  .post(addAdmin)
router
  .route("/items")
  .get(verifyToken, validUser, getItemsSysytemAdmin)
router
  .route("/department")
  .post(verifyToken, validUser, addDepartment)
router
  .route("/department")
  .get(verifyToken, validUser, getdepartmentList)

module.exports = router