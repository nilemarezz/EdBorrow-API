const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verify')
const validUser = require('../middleware/validUser')


const { getAllBorrowItems, getCategoryNameOrDepartmentName, getBorrowItemById, getSearchBorrowItems, addItem, getItemByDepartment, updateItem } = require("../Controller/Item")
router
  .route("/")
  .get(getAllBorrowItems)
  .post(verifyToken, validUser, addItem)
  .put(verifyToken, validUser, updateItem)
router
  .route("/admin")
  .get(verifyToken, validUser, getItemByDepartment)
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