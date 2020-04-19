const express = require("express");
const router = express.Router();
const {getUserDetail, userLogin, getUserRole} = require("../Controller/User")
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')
router
    .route("/detail")
    .get(verifyToken,validUser,getUserDetail)
router
    .route("/login")
    .post(userLogin)
// router
//     .route("/role")
//     .get(verifyToken,validUser,getUserRole)
    

module.exports = router;