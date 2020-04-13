const express = require("express");
const router = express.Router();
const {getUserDetail, userLogin, postVerifyToken} = require("../Controller/User")
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')
router
    .route("/detail")
    .get(verifyToken,validUser,getUserDetail)
router
    .route("/login")
    .post(userLogin)

module.exports = router;