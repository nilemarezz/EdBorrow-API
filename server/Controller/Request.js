const RequestModel = require('../Model/Request');
const { actionLogs } = require(`../Model/Data`);
const { sendEmailRequest } = require('../Utilities/EmailService/SendEmail');
const requests = new RequestModel();
const printlog = require('../config/logColor');
const {
  CREATE_REQUEST,
  CHANGE_STATUS_APPROVE,
  REDIRECT_APPROVE_URL,
} = require('../Utilities/RequestUrl');
const checkDepartmentId = require('../Utilities/checkDepartmentId')


exports.postCreateRequest = async (req, res, next) => {
  try {
    let borrowRequest = await requests.createRequest(req.body, req.body.items);
    let url = CREATE_REQUEST(borrowRequest[0].requestId);
    await sendEmailRequest(
      { data: borrowRequest },
      req.body.personalInformation.advisorEmail,
      url,
      "create request"
    );
    printlog(
      'Green',
      `Send request success -  ${res.locals.authData.user[0].userId}`
    );
    await actionLogs.CREATE_REQUEST_LOG(req.body.personalInformation.userId, true, 'Success');
    res
      .status(200)
      .json({ result: 'success', msg: '[Email] sent request success' });
  } catch (err) {
    printlog(
      'Red',
      `Send request Fail - ${res.locals.authData.user[0].userId}`
    );
    console.log(err);
    await actionLogs.CREATE_REQUEST_LOG(req.body.personalInformation.userId, false, err.code);
    res.status(500).json({ result: 'false', msg: err });
    next(err);
  }
};

exports.departmentApproveEachItem = async (req, res, next) => {
  try {
    const change = await requests.departmentApproveEachItem(req.body);
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
    let borrowRequest = await requests.getRequest(req.query.requestId);
    if (req.query.approver === 'advisor') {
      if (borrowRequest[0].requestApprove !== 2 || borrowRequest[0].requestApprove !== 3) {
        printlog('Yellow', 'Advisor already action or this report expired');
        res.redirect(REDIRECT_APPROVE_URL().APPROVE_ALREADY);
      } else {
        if (req.query.status === 'TRUE') {
          const approvedRequest = await requests.advisorAllApprove(req.query);

          printlog('Green', 'Advisor Approve the request');

          let newItems = [];
          let data;
          for (let i = 0; i < approvedRequest.length; i++) {
            let idxOwner = newItems.findIndex(item => item.email === approvedRequest[i].itemOwnerEmail);
            data = {
              requestId: approvedRequest[i].requestId,
              itemId: approvedRequest[i].itemId,
              departmentId: approvedRequest[i].departmentId,
              departmentName: approvedRequest[i].departmentName,
              itemName: approvedRequest[i].itemName,
              userId: approvedRequest[i].userId,
              Name: approvedRequest[i].Name,
              email: approvedRequest[i].email,
              userTelNo: approvedRequest[i].userTelNo,
              borrowDate: approvedRequest[i].borrowDate,
              returnDate: approvedRequest[i].returnDate,
              borrowPurpose: approvedRequest[i].borrowPurpose
            };

            if (idxOwner !== -1) {
              newItems[idxOwner].item.push(data);
            } else {
              newItems.push({
                email: approvedRequest[i].itemOwnerEmail,
                item: [data]
              });
            }
          }

          let url;
          for (let j = 0; j < newItems.length; j++) {
            url = CHANGE_STATUS_APPROVE(newItems[j].item);
            await sendEmailRequest(
              { data: newItems[j] },
              newItems[j].email,
              url,
              "approve"
            );
          }
          printlog('Green', 'Success sending email to the item owner.');
          res.redirect(REDIRECT_APPROVE_URL().APPROVE_SUCCESS);

        } else {
          approvedRequest = await requests.advisorAllApprove(req.query);
          rejectAdvisorApproveItem = await requests.rejectAllRequest(
            req.query,
            (type = 'advisor')
          );
          printlog('Yellow', 'Advisor Reject the request');
          res.redirect(
            REDIRECT_APPROVE_URL(req.query.requestId).APPROVE_FAIL_REQUEST_ID
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
          type = 'department'
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
  printlog('Yellow', 'Check late item...');

  for (let i = 0; i < requests.length; i++) {
    if (request[i].returnDate < todayDate) {
      printlog('Yellow', `Late Item Id: ${request[i].requestId}`);

      requests.departmentChangeStatus({
        itemBorrowingStatusId: 3,
        requestId: request[i].requestId,
        itemId: request[i].itemId,
      });
    }
  }
};

exports.checkExpRequest = async (req, res, next) => {
  let borrowRequest = await requests.checkExpRequests();
  printlog('Yellow', 'Check expired request...');
  for (let i = 0; i < borrowRequest.length; i++) {
    if (borrowRequest[i].dateDiff === 3) {
      if (borrowRequest[i].requestApprove === 2) {
        printlog('Yellow', `Expired Request Id: ${borrowRequest[i].requestId}`);
        await requests.updateRequestApprove(borrowRequest[i].requestId);
      }
    }
  }
}

exports.getRequestList = async (req, res, next) => {
  try {
    let requestList = await requests.getRequestList(
      res.locals.authData.user[0].userId
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
      requestDetail: requestDetail,
      requestItem: requestItem
    }
    res.status(200).json({ result: "success", data: ResData });
  } catch (err) {
    console.log(err)
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
