const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')

const { Dashboard } = require('../Controller/Data')
router
  .route("/dashboard")
  .get(Dashboard)