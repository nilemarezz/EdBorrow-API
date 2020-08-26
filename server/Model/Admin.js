const pool = require('../config/BorrowSystemDB');

const addAdmin = async (userId, firstName, lastName, password) => {
  await pool.query(`INSERT INTO Users (userId ,firstName , lastName , password  , email) VALUES ("${userId}" , "${firstName}" , "${lastName}" , "${password}" , ${null})`)
  await addUserRole(userId, 99)
  return true
}

const addItemDepartment = async (departmentName, departmentTelNo, departmentEmail, placeBuilding, placeFloor, placeRoom) => {
  const placeId = await addDepartmentPlace(placeBuilding, placeFloor, placeRoom)
  const department = await pool.query(`INSERT INTO ItemDepartment (departmentName , departmentTelNo , departmentEmail , placeId) 
  VALUES ("${departmentName}" , "${departmentTelNo}" , "${departmentEmail}" , ${placeId})`)
  return department.insertId
}

const addUserDepartment = async (userId, firstName, lastName, password, departmentId) => {
  const user = await pool.query(`INSERT INTO Users (userId ,firstName , lastName , password  , email) VALUES ("${userId}" , "${firstName}" , "${lastName}" , "${password}" , ${null})`)
  await addDepartmentRole(departmentId, firstName)
  await addUserRole(userId, departmentId)
  return user
}

const addDepartmentRole = async (roleId, firstName) => {
  await pool.query(`INSERT INTO Roles (roleId ,roleTag) VALUES (${roleId} , "${firstName}");`)
}
const addUserRole = async (userId, roleId) => {
  await pool.query(`INSERT INTO UserRole VALUES  ("${userId}", ${roleId}) `)
  return true
}

const addDepartmentPlace = async (placeBuilding, placeFloor, placeRoom) => {
  const place = await pool.query(`INSERT INTO DepartmentPlace (placeBuilding , placeFloor , placeRoom) VALUES 
  ("${placeBuilding}" , ${placeFloor} , "${placeRoom}")
  `)
  return place.insertId
}

module.exports = { addAdmin, addItemDepartment, addUserDepartment }