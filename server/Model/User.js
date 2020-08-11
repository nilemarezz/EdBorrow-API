const pool = require("../config/BorrowSystemDB");
const { ASSIGN_ROLE, CHANGE_PASSWORD, CREATE_USER,
  GET_LOGIN, GET_PASSWORD, GET_USER_BY_ID, GET_USER_DETAIL, USER_ROLE } = require("./queries/User")
class Users {
  constructor() {
    this.users;
  }

  async getLogin(userId) {
    this.users = await pool.query(
      GET_LOGIN(userId)
    );
    return this.users;
  }
  async getUserDetails(id) {
    this.users = await pool.query(GET_USER_DETAIL(id));
    return this.users;
  }
  async getUserById(userId) {
    this.users = await pool.query(GET_USER_BY_ID(userId))
    return this.users;
  }
  async createUser(email, password, firstname, lastname, phonenumber) {
    this.users = await pool.query(CREATE_USER(email, password, firstname, lastname, phonenumber))
  }
  async getUserRole(id) {
    this.users = await pool.query(USER_ROLE(id));
    return this.users;
  }
  async assignRole(id) {
    this.users = await pool.query(ASSIGN_ROLE(id));
    return this.users;
  }
  async getPassword(id) {
    this.users = await pool.query(GET_PASSWORD(id));
    return this.users;
  }
  async changePassword(id, password) {
    this.users = await pool.query(CHANGE_PASSWORD(id, password));
    return this.users;
  }
}

module.exports = Users;
