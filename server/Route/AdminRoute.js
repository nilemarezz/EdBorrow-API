const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')
const { addAdmin } = require('../Controller/Admin')
router
  .route("/addAdmin")
  .post(addAdmin)

module.exports = router