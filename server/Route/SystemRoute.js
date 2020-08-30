const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')

const { SystemData, OSData } = require('../Controller/Data')
router
  .route("/systemdata")
  .get(SystemData)
router
  .route("/osdata")
  .get(OSData)

module.exports = router;