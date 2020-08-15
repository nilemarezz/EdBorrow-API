const config = require ('../config.json');

const CREATE_REQUEST = requestId => {
  if (config.NODE_ENV === 'development') {
    return `http://localhost:3000/api/request/approve?requestId=${requestId}&approver=advisor`;
  } else {
    return `http://edborrow.ga/api/request/approve?requestId=${requestId}&approver=advisor`;
  }
};

const CHANGE_STATUS_APPROVE = item => {
  
    return {
    ITEM_APPROVE_ON_LOCAL: `http://localhost:3000/api/request/approve/?requestId=${item.requestId}&approver=department&departmentId=${item.departmentId}`,
    ITEM_APPROVE_ON_SERVER: `http://edborrow.ga/api/request/approve/?requestId=${item.requestId}&approver=department&departmentId=${item.departmentId}`,
  };
};

module.exports = {
  CREATE_REQUEST,
  CHANGE_STATUS_APPROVE,
};
