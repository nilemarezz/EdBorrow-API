const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')

const { Dashboard, DepartmentList } = require('../Controller/Data')
router
  .route("/dashboard")
  .get(verifyToken, validUser, Dashboard)
router
  .route("/department")
  .get(DepartmentList)
module.exports = router;