const pool = require("../config/BorrowSystemDB");
const { ASSIGN_ROLE, CHANGE_PASSWORD, CREATE_USER,
  GET_LOGIN, GET_PASSWORD, GET_USER_BY_ID, GET_USER_DETAIL, USER_ROLE } = require("./queries/User")
class Users {
  constructor() {
    this.users;
  }

  async getLogin(userId) {
    this.users = await pool.query(
      `SELECT userId,firstName,password FROM Users WHERE userId = '${userId}';`
    );
    return this.users;
  }

  async getUserDetails(id) {
    this.users = await pool.query(
      `SELECT u.* , CONCAT(a.firstName , " " , a.lastName) as advisorName
      FROM Users u left join Users a on a.userId = u.studentAdvisor
      WHERE u.userId = '${id}';`
    );
    return this.users;
  }

  async getUserById(userId) {
    this.users = await pool.query(`
      SELECT *
      FROM Users
      WHERE userId = '${userId}';
    `)
    return this.users;
  }

  async createUser(email, password, firstname, lastname, phonenumber) {
    this.users = await pool.query(`
      INSERT INTO Users (userId, password, email, firstName, lastName, userTelNo , studentAdvisor) 
      VALUES ("${email}", "${password}", "${email}", "${firstname}", "${lastname}" , "${phonenumber}" , "testAdvisor");
    `)
  }

  async getUserRole(id) {
    this.users = await pool.query(
      `select * from UserRole ur where userId = "${id}" `
    );
    return this.users;
  }
  async assignRole(id) {
    this.users = await pool.query(
      `INSERT INTO UserRole values ('${id}' , 10) `
    );
    return this.users;
  }
  async getPassword(id) {
    this.users = await pool.query(
      `SELECT password FROM Users u WHERE userId = '${id}' `
    );
    return this.users;
  }
  async changePassword(id, password) {
    this.users = await pool.query(
      `UPDATE Users SET password = '${password}' WHERE userId = '${id}'`
    );
    return this.users;
  }



}

module.exports = Users;
