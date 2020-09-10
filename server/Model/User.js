const pool = require("../config/BorrowSystemDB");
const { ASSIGN_ROLE, CHANGE_PASSWORD, CREATE_USER,
  GET_LOGIN, GET_PASSWORD, GET_USER_BY_ID, GET_USER_DETAIL, USER_ROLE, GET_ADVISOR_LIST, GET_USER_LIST,
  DELETE_USER_ROLE, DELETE_USER
} = require("./queries/User")
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
  async getAdvisorList() {
    this.users = await pool.query(GET_ADVISOR_LIST());
    return this.users;
  }
  async getUserById(userId) {
    this.users = await pool.query(GET_USER_BY_ID(userId))
    return this.users;
  }
  async createUser(email, password, firstname, lastname, phonenumber, advisor) {
    this.users = await pool.query(CREATE_USER(email, password, firstname, lastname, phonenumber, advisor))
  }
  async getUserRole(id) {
    this.users = await pool.query(USER_ROLE(id));
    return this.users;
  }
  async assignRole(id, role) {
    this.users = await pool.query(ASSIGN_ROLE(id, role));
    return this.users;
  }
  async getPassword(id) {
    this.users = await pool.query(GET_PASSWORD(id));
    return this.users;
  }
  async getUserList() {
    this.users = await pool.query(GET_USER_LIST());
    return this.users;
  }
  async changePassword(id, password) {
    this.users = await pool.query(CHANGE_PASSWORD(id, password));
    return this.users;
  }
  async deleteUserRole(id) {
    this.users = await pool.query(DELETE_USER_ROLE(id));
    return this.users;
  }
  async deleteUser(id) {
    this.users = await pool.query(DELETE_USER(id));
    return this.users;
  }
  async AddUser(value) {
    this.users = await pool.query(CREATE_USER(value.userId, value.password, value.email, value.firstName, value.lastName, value.telNo, null));
    return this.users;
  }
}

module.exports = Users;
