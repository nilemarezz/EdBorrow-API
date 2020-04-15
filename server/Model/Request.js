const pool = require("../config/BorrowSystemDB");

class ItemRequest {
  constructor() {
    this.request;
  }

  async createRequest(body) {
    if (body.personalInformation) {
      this.request = await pool.query(
        `INSERT INTO BorrowRequest (userId , borrowPurpose , usePlace) 
          VALUES('${body.personalInformation.userId}' , '${body.personalInformation.borrowPurpose}' , '${body.personalInformation.usePlace}');`
      );
      let lastInsertId = this.request.insertId;
      // console.log(lastInsertId);
      if (body.items) {
        for (var i = 0; i < body.items.length; i++) {
          await pool.query(
            `INSERT INTO RequestItem (requestId , itemId, borrowDate , returnDate ) 
                      VALUES(${lastInsertId}, ${body.items[i].itemId} , '${body.personalInformation.borrowDate}', '${body.personalInformation.returnDate}');`
          );
          await pool.query(
            `UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
            SET ri.itemBorrowingStatusId = 4 , i.itemAvailability = FALSE WHERE ri.itemId = ${body.items[i].itemId};`
          ); //chage status to Booking and availability to FALSE (booking and can't borrow in other request)
        }
      }
      this.request = await pool.query(`
      SELECT br.requestId , br.userId , CONCAT(u.firstName , " ", u.lastName) as Name , u.curriculum , u.email , u.studentYear , u.userTelNo , 
		      i.itemName , d.departmentId , br.borrowPurpose , br.usePlace , ri.returnDate , ri.borrowDate , a.userId as studentAdvisor, a.email as advisorEmail
      FROM BorrowRequest br join RequestItem ri on br.requestId = ri.requestId 
          join Items i on ri.itemId = i.itemId 
          join ItemDepartment d on i.departmentId = d.departmentId
					left join Users u on br.userId = u.userId 
					inner join Users a on a.userId = u.studentAdvisor 
      WHERE br.requestId = ${lastInsertId};`);
    }
    return this.request;
  }

  async getRequest(requestId) {
    this.request = await pool.query(
      `SELECT * FROM BorrowRequest WHERE requestId = ${requestId}`
    );
    return this.request;
  }
  async getRequestItem(requestId) {
    this.request = await pool.query(
      `SELECT ri.* , i.*
      FROM BorrowRequest br join RequestItem ri on br.requestId = ri.requestId
                            join Items i on ri.itemId = i.itemId
      WHERE br.requestId = ${requestId};`
    );
    return this.request;
  }

  async getRequestList(userId) {
    this.request = await pool.query(`
    SELECT br.*, u.firstName , u.*
    FROM BorrowRequest br left join Users u on br.userId = u.userId
    WHERE br.userId = '${userId}';
    `);
    return this.request;
  }

  async advisorApprove(query) {
    if (query.approver === "advisor" && query.status === "TRUE") {
      await pool.query(
        `UPDATE BorrowRequest SET requestApprove = TRUE WHERE requestId = ${query.requestId};`
      );
    } else if (query.approver === "advisor" && query.status === "FALSE") {
      await pool.query(`
      UPDATE BorrowRequest br join RequestItem ri on br.requestId = ri.requestId 
          join Items i on ri.itemId = i.itemId 
      SET br.requestApprove = FALSE, ri.itemBorrowingStatusId = NULL, i.itemAvailability = TRUE 
      WHERE br.requestId = ${query.requestId};`);
    }
    this.request = await pool.query(`
    SELECT br.requestId , br.userId , CONCAT(u.firstName , " ", u.lastName) as Name , u.curriculum , u.email , u.studentYear , u.userTelNo , 
		      i.itemId , i.itemName , d.departmentId , d.departmentName , d.departmentEmail , br.borrowPurpose , br.usePlace , ri.returnDate , ri.borrowDate , 
		      a.userId as studentAdvisor, CONCAT(a.firstName, " ", a.lastName) as advisorName, a.email as advisorEmail , br.requestApprove 
    FROM BorrowRequest br join RequestItem ri on br.requestId = ri.requestId 
					join Items i on ri.itemId = i.itemId 
					left join Users u on br.userId = u.userId 
					inner join Users a on a.userId = u.studentAdvisor 
					join ItemDepartment d on i.departmentId = d.departmentId 
    WHERE br.requestId = ${query.requestId};
    `);
    return this.request;
  }

  async departmentApprove(query) {
    
    if (query.approver === "department" && query.status === "TRUE") {
      console.log('in query')
      await pool.query(`
      UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
      SET ri.itemApprove = TRUE , ri.itemBorrowingStatusId = 6 , i.itemAvailability = FALSE 
      WHERE ri.requestId = ${query.requestId} AND i.departmentId = ${query.departmentId};`);
    } else if (query.approver === "department" && query.status === "FALSE") {
      await pool.query(`
      UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
      SET ri.itemApprove = FALSE , ri.itemBorrowingStatusId = 5 , i.itemAvailability = TRUE 
      WHERE ri.requestId = ${query.requestId} AND i.departmentId = ${query.departmentId};
      `);
    }
    return this.request;
  }

  async rejectApproveItem(query, type) {
    console.log(query)
    if (type === "advisor") {
      await pool.query(`
          UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
          SET ri.itemBorrowingStatusId = 5 , ri.itemApprove = 0 
          WHERE ri.requestId = ${query.requestId}
      `);
    } else if (type === "department") {
      console.log('in department query')
      await pool.query(`
      UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
      SET ri.itemBorrowingStatusId = 5 , ri.itemApprove = 0 
      WHERE ri.requestId = ${query.requestId} AND i.departmentId = ${query.departmentId}
  `);
    }
  }
}

module.exports = ItemRequest;
