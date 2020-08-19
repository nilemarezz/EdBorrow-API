const RequestModel = require('../Model/Request');
const { sendEmailRequest } = require('../Utilities/EmailService/SendEmail');
const requests = new RequestModel();
const config = require('../config.json');
const printlog = require('../config/logColor');
const { getUserRole } = require('./User');
const {
  CREATE_REQUEST,
  CHANGE_STATUS_APPROVE,
  REDIRECT_APPROVE_URL,
} = require('../Utilities/RequestUrl');
const checkDepartmentId = require('../Utilities/checkDepartmentId')

exports.postCreateRequest = async (req, res, next) => {
  try {
    let borrowRequest = await requests.createRequest(req.body);
    let url = CREATE_REQUEST(borrowRequest[0].requestId);

    await sendEmailRequest(
      { data: borrowRequest },
      req.body.personalInformation.advisorEmail,
      url
    );
    printlog(
      'Green',
      `Send request success - ${res.locals.authData.user[0].userId}`
    );
    res
      .status(200)
      .json({ result: 'success', msg: '[Email] sent request success' });
  } catch (err) {
    printlog(
      'Red',
      `Send request Fail - ${res.locals.authData.user[0].userId}`
    );
    console.log(err);
    res.status(500).json({ result: 'false', msg: err });
    next(err);
  }
};

exports.departmentApproveEachItem = async (req, res, next) => {
  try {
    await requests.departmentApproveEachItem(req.body);
    printlog(
      'Green',
      `Approve Item success - ${res.locals.authData.user[0].userId}`
    );
    res.status(200).json({ result: 'success', msg: 'Item Approve Success' });
  } catch (err) {
    printlog(
      'Red',
      `Approve request Fail - ${res.locals.authData.user[0].userId}`
    );
    console.log(err);
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.departmentChangeStatus = async (req, res, next) => {
  try {
    await requests.departmentChangeStatus(req.body);
    printlog(
      'Green',
      `Change Status Success - ${res.locals.authData.user[0].userId}`
    );
    res
      .status(200)
      .json({ result: 'success', msg: 'Item Change Status Success' });
  } catch (err) {
    printlog(
      'Red',
      `Change Status Fail - ${res.locals.authData.user[0].userId}`
    );
    console.log(err);
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.approveAllItem = async (req, res, next) => {
  try {
    let borrowRequest;
    borrowRequest = await requests.getRequest(req.query.requestId);

    if (req.query.approver === 'advisor') {
      if (borrowRequest[0].requestApprove !== 2) {
        printlog('Yellow', 'Advisor Already Action this report');
        res.redirect(REDIRECT_APPROVE_URL().APPROVE_ALREADY);
      } else {
        if (req.query.status === 'TRUE') {
          approvedRequest = await requests.advisorAllApprove(req.query);

          printlog('Green', 'Advisor Approve the request');

          let itemInfra = [];
          let itemSRM = [];
          let itemLAB = [];

          if (approvedRequest[0].requestApprove === 1) {
            for (let i = 0; i < approvedRequest.length; i++) {
              if (approvedRequest[i].departmentName === 'SRM') {
                itemSRM.push(approvedRequest[i]);
              } else if (
                approvedRequest[i].departmentName === 'IT Infrastructure'
              ) {
                itemInfra.push(approvedRequest[i]);
              } else if (approvedRequest[i].departmentName === 'LAB') {
                itemLAB.push(approvedRequest[i]);
              }
            }

            if (itemInfra.length > 0) {
              let url;
              url = CHANGE_STATUS_APPROVE(itemInfra[0]);
              await sendEmailRequest(
                { data: itemInfra },
                itemInfra[0].departmentEmail,
                url
              );
            }
            if (itemSRM.length > 0) {
              let url;
              url = CHANGE_STATUS_APPROVE(itemSRM[0]);
              await sendEmailRequest(
                { data: itemSRM },
                itemSRM[0].departmentEmail,
                url
              );
            }
            if (itemLAB.length > 0) {
              let url;
              url = url = CHANGE_STATUS_APPROVE(itemLAB[0]);
              await sendEmailRequest(
                { data: itemLAB },
                itemLAB[0].departmentEmail,
                url
              );
            }

            printlog('Green', 'Success sending email to the department');
            res.redirect(REDIRECT_APPROVE_URL().APPROVE_SUCCESS);
          }
        } else {
          approvedRequest = await requests.advisorAllApprove(req.query);
          rejectAdvisorApproveItem = await requests.rejectAllRequest(
            req.query,
            (type = 'advisor')
          );
          printlog('Yellow', 'Advisor Reject the request');
          res.redirect(
            REDIRECT_APPROVE_URL(req.body.requestId).APPROVE_FAIL_REQUEST_ID
          );
        }
      }
    } else {
      if (req.query.status === 'TRUE') {
        approvedRequest = await requests.departmentAllApprove(req.query);

        printlog('Green', 'Department Approve the request');
        res.redirect(REDIRECT_APPROVE_URL().APPROVE_SUCCESS);
      } else {
        approvedRequest = await requests.departmentAllApprove(req.query);
        rejectApproveItem = await requests.rejectAllRequest(
          req.query,
          (type = 'department')
        );
        printlog('Yellow', 'Department Reject the request');

        res.redirect(REDIRECT_APPROVE_URL().APPROVE_FAIL);
      }
    }
  } catch (err) {
    printlog('Red', err);
    next(err);
  }
};

exports.checkLateItem = async () => {
  const todayDate = await new Date();
  const request = await requests.getAllRequestItem();
  printlog('Yellow', 'Check late...');

  for (let i = 0; i < requests.length; i++) {
    if (request[i].returnDate < todayDate) {
      printlog('Yellow', `Late: ${request[i].requestId}`);

      requests.departmentChangeStatus({
        itemBorrowingStatusId: 3,
        requestId: request[i].requestId,
        itemId: request[i].itemId,
      });
    }
  }
};

exports.getRequestList = async (req, res, next) => {
  try {
    let requestList = await requests.getRequestList(
      res.locals.authData.user[0].userId, department
    );
    res.status(200).json({ result: 'success', data: requestList });
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.getRequestItem = async (req, res, next) => {
  try {
    let requestDetail = await requests.getRequestDetail(req.params.requestId, res.locals.authData.user[0].userId);
    let requestItem = await requests.getRequestItem(req.params.requestId)
    let ResData = {
      requestDetail: { ...requestDetail[0], borrowDate: requestItem[0].borrowDate, returnDate: requestItem[0].returnDate },
      requestItem: requestItem
    }
    res.status(200).json({ result: "success", data: ResData });
  } catch (err) {
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.getRequestItemAdmin = async (req, res, next) => {
  try {
    const department = await checkDepartmentId(res.locals.authData.user[0].userId)
    let itemonDepartment = await requests.getRequestItemAdmin(
      res.locals.authData.user[0].userId,
      department
    );
    res.status(200).json({ result: 'success', data: itemonDepartment });
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: 'false', msg: err });
  }
};

exports.rejectPurpose = async (req, res, next) => {
  try {
    let itemonUser = await requests.rejectPurpose(
      req.body.requestId,
      req.body.text,
      req.body.itemId,
      req.body.type
    );
    printlog('Yellow', 'Add reject Purpose');
    res.status(200).json({ result: 'success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: 'false', msg: err });
  }
};
