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
const actionLogs = {
  CREATE_REQUEST_LOG: async (userId, toComplete, description) => { await pool.query(USER_ACTION_LOG(userId, "Create request", toComplete, description)) },
  ADD_ITEM_LOG: async (userId, toComplete, description) => { await pool.query(USER_ACTION_LOG(userId, "Add item", toComplete, description)) },
  UPDATE_ITEM_LOG: async (userId, toComplete, description) => { await pool.query(USER_ACTION_LOG(userId, "Update item", toComplete, description)) },
  DELETE_ITEM_LOG: async (userId, toComplete, description) => { await pool.query(USER_ACTION_LOG(userId, "Delete item", toComplete, description)) },
  CHANGE_PASSWORD_LOG: async (userId, toComplete, description) => { await pool.query(USER_ACTION_LOG(userId, "Change password", toComplete, description)) },
  ADD_DEPARTMENT_LOG: async (userId, toComplete, description) => { await pool.query(USER_ACTION_LOG(userId, "Add department", toComplete, description)) },
  DELETE_DEPARTMENT_LOG: async (userId, toComplete, description) => { await pool.query(USER_ACTION_LOG(userId, "Delete department", toComplete, description)) },
  DELETE_USER_LOG: async (userId, toComplete, description) => { await pool.query(USER_ACTION_LOG(userId, "Delete User", toComplete, description)) },
  CREATE_USER_LOG: async (userId, toComplete, description) => { await pool.query(USER_ACTION_LOG(userId, "Create User", toComplete, description)) },
  OWNER_APPROVE: async (userId, type, toComplete, description) => { await pool.query(USER_ACTION_LOG(userId, type, toComplete, description)) },
  OWNER_CHANGE_STATUE_BORROW: async (userId, type, toComplete, description) => { await pool.query(USER_ACTION_LOG(userId, type, toComplete, description)) }
}

module.exports = { getLastestBorrow, getMostBorrow, getWaitingRequest, countItems, countByMonth, actionLogs }
