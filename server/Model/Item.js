const pool = require('../config/BorrowSystemDB');
const { GET_ALL_ITEM, GET_ITEM_BY_ID, GET_CATEGORY, GET_DEPARTMENT, GET_OWNER,
  DELETE_ALL_ITEMS, ADD_ITEM, GET_DEPARTMENT_BY_ID, UPDATE_ITEM, GET_VALID_DATE_ITEM, DELETE_ITEM_BY_ID } = require('./queries/Item')
const refactorItemDetail = require('../Utilities/refactorItemDetail')
class BorrowItem {
  constructor() {
    this.borrowItem;
  }

  async getAllItem() {
    this.borrowItem = await pool.query(GET_ALL_ITEM());
    return this.borrowItem;
  }

  async getItemById(id, department) {
    const item = await pool.query(GET_ITEM_BY_ID(id, department));
    this.borrowItem = [refactorItemDetail(item[0], department)]
    return this.borrowItem;
  }

  async getCategory() {
    this.borrowItem = await pool.query(GET_CATEGORY());
    return this.borrowItem;
  }

  async getDepartment() {
    this.borrowItem = await pool.query(GET_DEPARTMENT());
    return this.borrowItem;
  }

  async getOwner() {
    this.borrowItem = await pool.query(GET_OWNER());
    return this.borrowItem;
  }

  async getValidateByItemId(value) {
    this.borrowItem = await pool.query(GET_VALID_DATE_ITEM(value));
    return this.borrowItem
  }

  async removeAllItems() {
    this.borrowItem = await pool.query(DELETE_ALL_ITEMS());
    return this.borrowItem;
  }

  async removeItemById(itemId) {
    this.borrowItem = await pool.query(DELETE_ITEM_BY_ID(itemId));
    return this.borrowItem
  }

  async addItem(value) {
    this.borrowItem = await pool.query(ADD_ITEM(value))
    return this.borrowItem
  }

  async getItemByDepartment(userId, department) {
    this.borrowItem = await pool.query(GET_DEPARTMENT_BY_ID(userId, department));
    return this.borrowItem;
  }

  async updateItem(value, department, userId) {
    this.borrowItem = await pool.query(UPDATE_ITEM(value, department, userId))
    return this.borrowItem;
  }
}

module.exports = BorrowItem;
