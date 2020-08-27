const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')
const { addAdmin, addDepartment, getItemsSysytemAdmin } = require('../Controller/Admin')
router
  .route("/addAdmin")
  .post(addAdmin)
router
  .route("/items")
  .get(verifyToken, validUser, getItemsSysytemAdmin)
router
  .route("/department")
  .post(verifyToken, validUser, addDepartment)

module.exports = router