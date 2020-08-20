const pool = require('../config/BorrowSystemDB');
const { createMonthArray } = require('../Utilities/createMonthArray')
const { GET_LASTEST_BORROW, GET_MOST_BORROW, GET_REQUEST_STATUS, COUNT_ITEMS, COUNT_BY_MINTH } = require('../Model/queries/Data')

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
  const count = await pool.query(COUNT_BY_MINTH(department, userId))
  const month = createMonthArray(count)
  return month
}

module.exports = { getLastestBorrow, getMostBorrow, getWaitingRequest, countItems, countByMonth }
