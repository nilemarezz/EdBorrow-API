const pool = require('../config/BorrowSystemDB');
const { createMonthArray } = require('../Utilities/createMonthArray')
const { GET_LASTEST_BORROW, GET_MOST_BORROW, GET_REQUEST_STATUS, COUNT_ITEMS, COUNT_BY_MONTH, USER_ACTION_LOG } = require('../Model/queries/Data')

const getLastestBorrow = async (department, userId) => {
  const lastestBorrow = await pool.query(GET_LASTEST_BORROW(department, userId))
  return lastestBorrow
}
const getMostBorrow = async (department, userId) => {
  const mostBorrow = await pool.query(GET_MOST_BORROW(department, userId))
  const itemName = []
  const borrowTime = []
  mostBorrow.forEach(item => {
    itemName.push(item.itemName)
    borrowTime.push(item.Count)
  });
  return { itemName, borrowTime }
}
const getWaitingRequest = async (department, userId, type) => {
  const waiting = await pool.query(GET_REQUEST_STATUS(department, userId, type))
  return waiting
}
const countItems = async (department, userId) => {
  const items = await pool.query(COUNT_ITEMS(department, userId))
  return items
}
const countByMonth = async (department, userId) => {
  const count = await pool.query(COUNT_BY_MONTH(department, userId))
  const month = createMonthArray(count)
  return month
}
const actionLogs = () => {
  return {
    CREATE_REQUEST_LOG: (userId, toComplete) => await pool.query(USER_ACTION_LOG.CREATE_REQUEST_TO_LOG(userId, "Create request", toComplete)),
    ADD_ITEM_LOG: (userId, toComplete) => await pool.query(USER_ACTION_LOG.ADD_ITEM_TO_LOG(userId, "Add item", toComplete)),
    UPDATE_ITEM_LOG: (userId, toComplete) => await pool.query(USER_ACTION_LOG.UPDATE_ITEM_TO_LOG(userId, "Update item", toComplete)),
    DELETE_ITEM_LOG: (userId, toComplete) => await pool.query(USER_ACTION_LOG.DELETE_ITEM_TO_LOG(userId, "Delete item", toComplete)),
    CHANGE_PASSWORD_LOG: (userId, toComplete) => await pool.query(USER_ACTION_LOG.CHANGE_PASSWORD_TO_LOG(userId, "Change password", toComplete)),
    ADD_DEPARTMENT_LOG: (userId, toComplete) => await pool.query(USER_ACTION_LOG.ADD_DEPARTMENT_TO_LOG(userId, "Add department", toComplete))
  }
}

module.exports = { getLastestBorrow, getMostBorrow, getWaitingRequest, countItems, countByMonth, actionLogs }
