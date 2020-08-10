const GET_LOGIN = (userId) => {
  return `SELECT userId,firstName,password FROM Users WHERE userId = '${userId}';`
}
const GET_USER_DETAIL = (id) => {
  return `SELECT u.* , CONCAT(a.firstName , " " , a.lastName) as advisorName
  FROM Users u left join Users a on a.userId = u.studentAdvisor
  WHERE u.userId = '${id}';`
}
const GET_USER_BY_ID = (userId) => {
  return `SELECT *
  FROM Users
  WHERE userId = '${userId}';`
}
const CREATE_USER = (email, password, firstname, lastname, phonenumber) => {
  return `
  INSERT INTO Users (userId, password, email, firstName, lastName, userTelNo , studentAdvisor) 
  VALUES ("${email}", "${password}", "${email}", "${firstname}", "${lastname}" , "${phonenumber}" , "testAdvisor");
`
}
const USER_ROLE = (id) => {
  return `select * from UserRole ur where userId = "${id}" `
}
const ASSIGN_ROLE = (id) => {
  return `INSERT INTO UserRole values ('${id}' , 10) `
}
const GET_PASSWORD = (id) => {
  return `SELECT password FROM Users u WHERE userId = '${id}' `
}
const CHANGE_PASSWORD = (id, password) => {
  return `UPDATE Users SET password = '${password}' WHERE userId = '${id}'`
}

module.exports = { GET_LOGIN, GET_USER_DETAIL, GET_USER_BY_ID, CREATE_USER, USER_ROLE, ASSIGN_ROLE, GET_PASSWORD, CHANGE_PASSWORD }