const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')

const { SystemData, OSData, CpuData } = require('../Controller/Data')
router
  .route("/systemdata")
  .get(SystemData)
router
  .route("/osdata")
  .get(OSData)
router
  .route("/cpudata")
  .get(CpuData)
module.exports = router;