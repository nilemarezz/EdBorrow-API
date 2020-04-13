const pool = require ('../config/BorrowSystemDB');

class Users {
  constructor () {
    this.users;
  }

  async getLogin (body) {
    this.users = await pool.query (`SELECT userId,firstName FROM Users WHERE userId = '${body.userId}';`);
    return this.users;
  }

  async getUserDetails (id) {
    this.users = await pool.query (
      `SELECT u.* , CONCAT(a.firstName , " " , a.lastName) as advisorName
      FROM Users u left join Users a on a.userId = u.studentAdvisor
      WHERE u.userId = '${id}';`
    );
    return this.users;
  }
}

module.exports = Users;
