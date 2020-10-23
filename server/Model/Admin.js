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

const addUserDepartment = async (userId, firstName, lastName, password, departmentId, departmentName) => {
  const user = await pool.query(`INSERT INTO Users (userId ,firstName , lastName , password  , email) VALUES ("${userId}" , "${firstName}" , "${lastName}" , "${password}" , ${null})`)
  await addDepartmentRole(departmentId, departmentName)
  await addUserRole(userId, departmentId)
  return user
}

const addDepartmentRole = async (roleId, departmentName) => {
  await pool.query(`INSERT INTO Roles (roleId ,roleTag) VALUES (${roleId} , "${departmentName}");`)
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

const getItems = async () => {
  const items = await pool.query(`
  SELECT i.itemId , i.itemBrand , i.itemName , i.itemModel, i.createDate,i.itemImage , i.itemStatusId , i.itemDescription , ic.categoryName ,
  id.departmentName , id.departmentTelNo , id.departmentEmail , dp.placeBuilding , dp.placeFloor , dp.placeRoom , i.amount
  FROM Items i join ItemCategory ic on ic.categoryId = i.categoryId 
  join ItemDepartment id on id.departmentId = i.departmentId 
  join DepartmentPlace dp on dp.placeId = id.placeId 
  where i.departmentId is not null;
  `)
  return items
}

const getDepartment = async () => {
  const department = await pool.query(`
  select id.departmentId , id.departmentName , id.departmentEmail , id.departmentTelNo , dp.placeBuilding , dp.placeFloor , dp.placeRoom ,
  u.userId , CONCAT(u.firstName , " ", u.lastName) AS Name 
  from ItemDepartment id join DepartmentPlace dp on id.placeId = dp.placeId 
  join UserRole ur on ur.roleId = id.departmentId 
  join Users u on u.userId = ur.userId  
  `)
  return department
}

const deleteDepartment = async (departmentId) => {
  await pool.query(`DELETE FROM Items WHERE departmentId  = ${departmentId};`)
  await pool.query(`DELETE FROM ItemDepartment WHERE departmentId  = ${departmentId};`)
  await pool.query(`DELETE FROM DepartmentPlace WHERE placeId  = ${departmentId};`)
  await pool.query(`ALTER Table  Borrow.ItemDepartment AUTO_INCREMENT= 1;`)
  await pool.query(`ALTER TABLE Borrow.DepartmentPlace AUTO_INCREMENT=1;`)
  return true
}

const deleteUser = async (userId, departmentId) => {
  await pool.query(`DELETE FROM UserRole WHERE userId  = "${userId}";`)
  await pool.query(`DELETE FROM Roles WHERE roleId  = ${departmentId};`)
  await pool.query(`DELETE FROM Users WHERE  userId = "${userId}";`)
  return true
}
module.exports = { addAdmin, addItemDepartment, addUserDepartment, getItems, getDepartment, deleteDepartment, deleteUser }