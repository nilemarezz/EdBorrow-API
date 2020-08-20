const pool = require('../config/BorrowSystemDB');
const { GET_LASTEST_BORROW, GET_MOST_BORROW } = require('../Model/queries/Data')

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


module.exports = { getLastestBorrow, getMostBorrow }
