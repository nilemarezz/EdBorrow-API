const GET_LOGIN = (userId) => {
  return `SELECT userId,firstName,password FROM Users WHERE userId = '${userId}';`
}
const GET_USER_DETAIL = (id) => {
  return `SELECT u.userId ,u.firstName ,u.lastName ,u.email , CONCAT(a.firstName , " " , a.lastName) as advisorName
  FROM Users u left join Users a on a.userId = u.studentAdvisor
  WHERE u.userId = '${id}'`
}
const GET_USER_BY_ID = (userId) => {
  return `SELECT *
  FROM Users
  WHERE userId = '${userId}';`
}
const CREATE_USER = (userId, password, email, firstname, lastname, phonenumber, advisor) => {
  return `
  INSERT INTO Users (userId, password, email, firstName, lastName, userTelNo , studentAdvisor) 
  VALUES ("${userId}", "${password}", "${email}", "${firstname}", "${lastname}" , "${phonenumber}" , ${advisor === null ? null : `"${advisor}"`});
`
}
const USER_ROLE = (id) => {
  return `select ur.roleId from UserRole ur where userId = "${id}" `
}
const ASSIGN_ROLE = (id, role) => {
  return `INSERT INTO UserRole values ('${id}' , ${role}) `
}
const GET_PASSWORD = (id) => {
  return `SELECT password FROM Users u WHERE userId = '${id}' `
}
const CHANGE_PASSWORD = (id, password) => {
  return `UPDATE Users SET password = '${password}' WHERE userId = '${id}'`
}
const GET_ADVISOR_LIST = () => {
  return `SELECT u.userId , CONCAT(u.firstName , " ", u.lastName) as Name , u.email FROM Users u JOIN UserRole ur ON u.userId = ur.userId WHERE ur.roleId = 20`
}
const GET_USER_LIST = () => {
  return `
  select u.userId , CONCAT(u.firstName , " ", u.lastName) as Name, u.email , u.createDate , u.userTelNo , r.roleTag , r.roleId from Users u 
join UserRole ur on ur.userId = u.userId  
join Roles r on r.roleId = ur.roleId 
where r.roleId = 10 or r.roleId = 20 or r.roleId = 30 or r.roleId = 99;`
}
const DELETE_USER_ROLE = (id) => {
  return `DELETE FROM UserRole WHERE userId = "${id}";`
}
const DELETE_USER = (id) => {
  return `DELETE FROM Users WHERE userId = "${id}";`
}
module.exports = { GET_LOGIN, GET_USER_DETAIL, GET_USER_BY_ID, CREATE_USER, USER_ROLE, ASSIGN_ROLE, GET_PASSWORD, CHANGE_PASSWORD, GET_ADVISOR_LIST, GET_USER_LIST, DELETE_USER_ROLE, DELETE_USER }