const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')

const { Dashboard, DepartmentList, SystemLogs } = require('../Controller/Data')
router
  .route("/dashboard")
  .get(verifyToken, validUser, Dashboard)
router
  .route("/department")
  .get(DepartmentList)
router
  .route("/logs")
  .get(SystemLogs)
module.exports = router;