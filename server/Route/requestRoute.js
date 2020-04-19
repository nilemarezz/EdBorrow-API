const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')
const {postCreateRequest, getRequestList, getRequestItem, approveAllItem,getRequestItemAdmin,departmentApproveEachItem} = require("../Controller/Request")
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
    .post(departmentApproveEachItem)

    

module.exports = router;