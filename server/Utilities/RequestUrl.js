const config = require('../config.json');

const CREATE_REQUEST = requestId => {
  if (config.NODE_ENV === 'development') {
    return `http://localhost:3000/api/request/approve?requestId=${requestId}&approver=advisor`;
  } else {
    return `http://edborrow.ga/api/request/approve?requestId=${requestId}&approver=advisor`;
  }
};

const CHANGE_STATUS_APPROVE = item => {
  if (config.NODE_ENV === 'development') {
    return `http://localhost:3000/api/request/approve/?requestId=${item[0].requestId}&approver=department&departmentId=${item[0].departmentId}`;
  } else {
    return `http://edborrow.ga/api/request/approve/?requestId=${item[0].requestId}&approver=department&departmentId=${item[0].departmentId}`;
  }
};

const REDIRECT_APPROVE_URL = requestId => {
  return {
    APPROVE_ALREADY: `https://edborrow.netlify.com/#/approve/type/already`,
    APPROVE_SUCCESS: `https://edborrow.netlify.com/#/approve/type/success`,
    APPROVE_FAIL: `https://edborrow.netlify.com/#/approve/type/fail`,
    APPROVE_FAIL_REQUEST_ID: `https://edborrow.netlify.com/#/approve/type/fail?requestId=${requestId}`,
  };
};

module.exports = {
  CREATE_REQUEST,
  CHANGE_STATUS_APPROVE,
  REDIRECT_APPROVE_URL,
};
