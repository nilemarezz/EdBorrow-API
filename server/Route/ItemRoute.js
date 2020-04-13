const express = require("express");
const router = express.Router();
const {getAllBorrowItems, getCategoryNameOrDepartmentName, getBorrowItemById, getSearchBorrowItems} = require("../Controller/Item")
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
    
module.exports = router;