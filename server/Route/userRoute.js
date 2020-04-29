const express = require("express");
const router = express.Router();
const {getUserDetail, userLogin, getUserRole,userRegister,ChangePassword} = require("../Controller/User")
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')

router
    .route("/")
    .put(verifyToken,validUser,ChangePassword)
router
    .route("/detail")
    .get(verifyToken,validUser,getUserDetail)
router
    .route("/login")
    .post(userLogin)
router
    .route("/register")
    .post(userRegister)
// router
//     .route("/role")
//     .get(verifyToken,validUser,getUserRole)
    

module.exports = router;