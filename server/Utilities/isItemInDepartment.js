const pool = require('../config/BorrowSystemDB');

const isItemInDepartment = async (itemId) => {
  const department = await pool.query(`select i.departmentId from Items i where i.itemId = ${itemId};`)
  if (department[0].departmentId === null) {
    return false
  } else {
    return department[0].departmentId
  }
}

module.exports = isItemInDepartment