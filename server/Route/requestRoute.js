const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')
const {postCreateRequest, getRequestList, getRequestItem, approveAllItem,getRequestItemAdmin,departmentApproveEachItem,departmentChangeStatus,rejectPurpose} = require("../Controller/Request")
router
    .route("/")
    .post(verifyToken,validUser,postCreateRequest)
router
    .route("/approve")
    .get(approveAllItem)
    .put()
router
    .route("/")
    .get(verifyToken,validUser,getRequestList)
router
    .route("/detail/:requestId")
    .get(verifyToken,validUser,getRequestItem)
router
    .route("/admin")
    .get(verifyToken,validUser,getRequestItemAdmin)
router
    .route("/approve")
    .post(verifyToken,validUser,departmentApproveEachItem)
router
    .route("/changestatus")
    .post(verifyToken,validUser,departmentChangeStatus)
router
    .route("/rejectpurpose")
    .put(rejectPurpose)
    

module.exports = router;