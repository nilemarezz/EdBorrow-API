const pool = require('../config/BorrowSystemDB');

const addAdmin = async (userId, firstName, lastName, password) => {
  const user = await pool.query(`INSERT INTO Users (userId ,firstName , lastName , password  , email) VALUES ("${userId}" , "${firstName}" , "${lastName}" , "${password}" , ${null})`)
  const role = await pool.query(`INSERT INTO UserRole VALUES  ("${userId}", 99) `)
  return true
}

module.exports = { addAdmin }