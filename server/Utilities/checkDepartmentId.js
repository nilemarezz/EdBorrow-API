const pool = require('../config/BorrowSystemDB');

const checkDepartmentId = async (userId) => {
  const departmentId = await pool.query(`
  select id.departmentId from ItemDepartment id join UserRole ur on ur.roleId = id.departmentId 
  where ur.userId = "${userId}";
  `)
  if (departmentId.length === 0) {
    return false
  } else {
    return departmentId[0].departmentId
  }
}

module.exports = checkDepartmentId