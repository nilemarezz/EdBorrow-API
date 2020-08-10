const pool = require("../config/BorrowSystemDB");
const { DEPARTMENT_APPROVE_EACH_ITEM, DEPARTMENT_CHANGE_STATUS, CREATE_REQUEST
  , GET_REQUEST, GET_REQUEST_LIST,
  GET_REQUEST_ITEM, ADVISOR_CHANGE_REQUEST_STATUS, DEPARTMENT_CHANGE_REQUEST_STATUS, REJECT_ALL_REQUEST
  , GET_REQUEST_ADMIN, SET_REJECT_PURPOSE } = require("./queries/Request")
class ItemRequest {
  constructor() {
    this.request;
  }

  async departmentApproveEachItem(body) {
    this.request = await pool.query(DEPARTMENT_APPROVE_EACH_ITEM(body));
    return this.request;
  }
  async departmentChangeStatus(body) {
    this.request = await pool.query(DEPARTMENT_CHANGE_STATUS(body));
    return this.request;
  }

  async createRequest(body) {
    if (body.personalInformation) {
      this.request = await pool.query(
        CREATE_REQUEST(body, lastInsertId).INSERT_ITEMREQUEST_TO_DB
      );
      let lastInsertId = this.request.insertId;
      if (body.items) {
        for (var i = 0; i < body.items.length; i++) {
          await pool.query(
            CREATE_REQUEST(body, lastInsertId).INSERT_ITEMREQUEST_TO_DB
          );
          await pool.query(
            CREATE_REQUEST(body, lastInsertId).UPDATE_ITEM_AVALIBILITY
          ); //chage status to Booking and availability to FALSE (booking and can't borrow in other request)
        }
      }
      this.request = await pool.query(CREATE_REQUEST(body, lastInsertId).RETURN_REQUEST);
    }
    return this.request;
  }

  async getRequest(requestId) {
    this.request = await pool.query(GET_REQUEST(requestId));
    return this.request;
  }
  async getRequestItem(requestId) {
    this.request = await pool.query(GET_REQUEST_ITEM(requestId));
    return this.request;
  }

  async getRequestList(userId) {
    this.request = await pool.query(GET_REQUEST_LIST(userId));
    return this.request;
  }

  async advisorAllApprove(query) {
    if (query.approver === "advisor" && query.status === "TRUE") {
      await pool.query(
        ADVISOR_CHANGE_REQUEST_STATUS(query).APPROVE_ALL_APPROVE
      );
    } else if (query.approver === "advisor" && query.status === "FALSE") {
      await pool.query(ADVISOR_CHANGE_REQUEST_STATUS(query).REJECT_ALL_APPROVE);
    }
    this.request = await pool.query(ADVISOR_CHANGE_REQUEST_STATUS(query).RETURN_REQUEST);
    return this.request;
  }

  async departmentAllApprove(query) {
    if (query.approver === "department" && query.status === "TRUE") {
      await pool.query(DEPARTMENT_CHANGE_REQUEST_STATUS(query).DEPARTMENT_ALL_APPROVE)
    } else if (query.approver === "department" && query.status === "FALSE") {
      await pool.query(pool.query(DEPARTMENT_CHANGE_REQUEST_STATUS(query).DEPARTMENT_ALL_REJECT));
    }
    return this.request;
  }

  async rejectAllRequest(query, type) {
    if (type === "advisor") {
      await pool.query(REJECT_ALL_REQUEST(query).ADVISOR_REJECT);
    } else if (type === "department") {
      await pool.query(REJECT_ALL_REQUEST(query).DEPARTMENT_REJECT);
    }
  }

  async getRequestItemAdmin(id, type) {
    this.request = await pool.query(GET_REQUEST_ADMIN(id, type));
    return this.request;
  }

  async rejectPurpose(id, text, itemId, type) {
    if (type === "advisor") {
      this.request = await pool.query(
        SET_REJECT_PURPOSE(id, text, itemId).ADVISOR_SET_PURPOSE
      );
    } else {
      this.request = await pool.query(
        SET_REJECT_PURPOSE(id, text, itemId).DEPARTMENT_SET_PURPOSE
      );
    }


    return this.request;
  }
}

module.exports = ItemRequest;
