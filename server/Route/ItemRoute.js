const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')


const {getAllBorrowItems, getCategoryNameOrDepartmentName, getBorrowItemById, getSearchBorrowItems,addItem} = require("../Controller/Item")
router
    .route("/")
    .get(getAllBorrowItems)
    // .delete(deleteItem)
    // .post(addItem)
    // .put(updateItem)
router
    .route("/search")
    .get(getSearchBorrowItems)
router
    .route("/getColumn")
    .post(getCategoryNameOrDepartmentName)
router
    .route("/:id")
    .get(getBorrowItemById)
router
    .route("/")
    .post(verifyToken,validUser,addItem)

    
module.exports = router;