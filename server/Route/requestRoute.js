const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')
const {postCreateRequest, getRequestList, getRequestItem, advisorApprove, departmentApproveEachItem} = require("../Controller/Request")
router
    .route("/")
    .post(verifyToken,validUser,postCreateRequest)
router
    .route("/approve")
    .get(advisorApprove)
    .post(departmentApproveEachItem)
router
    .route("/")
    .get(verifyToken,validUser,getRequestList)
router
    .route("/detail/:requestId")
    .get(verifyToken,validUser,getRequestItem)

module.exports = router;