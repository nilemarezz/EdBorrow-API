const RequestModel = require("../Model/Request");
const { sendEmailRequest } = require("../Utilities/EmailService/SendEmail");
const requests = new RequestModel();
const config = require("../config.json");
const printlog = require("../config/logColor");
const { getUserRole } = require("./User");

exports.postCreateRequest = async (req, res, next) => {
  try {
    let borrowRequest = await requests.createRequest(req.body);
    let url;
    if (config.NODE_ENV === "development") {
      url = `http://localhost:3000/api/request/approve?requestId=${borrowRequest[0].requestId}&approver=advisor`;
    } else {
      url = `http://edborrow.ga/api/request/approve?requestId=${borrowRequest[0].requestId}&approver=advisor`;
    }
    // เขียนตรงนี้

    await sendEmailRequest(
      { data: borrowRequest },
      borrowRequest[0].advisorEmail,
      url
    );
    printlog("Green", `Send request success - ${res.locals.authData.user[0].userId}`)
    res
      .status(200)
      .json({ result: "success", msg: "[Email] sent request success" });
  } catch (err) {
    printlog("Red", `Send request Fail - ${res.locals.authData.user[0].userId}`)
    console.log(err)
    res.status(500).json({ result: "false", msg: err });
    next(err);
  }
};

exports.departmentApproveEachItem = async (req, res, next) => {
  try {
    await requests.departmentApproveEachItem(req.body);
    printlog("Green", `Approve Item success - ${res.locals.authData.user[0].userId}`)
    res.status(200).json({ result: "success", msg: "Item Approve Success" });
  } catch (err) {
    printlog("Red", `Approve request Fail - ${res.locals.authData.user[0].userId}`)
    console.log(err)
    res.status(500).json({ result: "false", msg: err });
  }
};

exports.departmentChangeStatus = async (req, res, next) => {
  try {
    await requests.departmentChangeStatus(req.body);
    printlog('Green', `Change Status Success - ${res.locals.authData.user[0].userId}`)
    res
      .status(200)
      .json({ result: "success", msg: "Item Change Status Success" });
  } catch (err) {
    printlog('Red', `Change Status Fail - ${res.locals.authData.user[0].userId}`)
    console.log(err)
    res.status(500).json({ result: "false", msg: err });
  }
};

exports.approveAllItem = async (req, res, next) => {
  try {
    let borrowRequest;
    borrowRequest = await requests.getRequest(req.query.requestId);

    if (req.query.approver === "advisor") {
      if (borrowRequest[0].requestApprove !== 2) {
        printlog("Yellow", "Advisor Already Action this report");
        res.redirect("https://edborrow.netlify.com/#/approve/type/already");
      } else {
        if (req.query.status === "TRUE") {
          approvedRequest = await requests.advisorAllApprove(req.query);

          printlog("Green", "Advisor Approve the request");
          let itemInfra = [];
          let itemSRM = [];
          let itemLAB = [];

          if (approvedRequest[0].requestApprove === 1) {
            for (let i = 0; i < approvedRequest.length; i++) {
              if (approvedRequest[i].departmentName === "SRM") {
                itemSRM.push(approvedRequest[i]);
              } else if (
                approvedRequest[i].departmentName === "IT Infrastructure"
              ) {
                itemInfra.push(approvedRequest[i]);
              } else if (approvedRequest[i].departmentName === "LAB") {
                itemLAB.push(approvedRequest[i]);
              }
            }

            if (itemInfra.length > 0) {
              let url;
              if (config.NODE_ENV === "development") {
                url = `http://localhost:3000/api/request/approve/?requestId=${itemInfra[0].requestId}&approver=department&departmentId=${itemInfra[0].departmentId}`;
              } else {
                url = `http://edborrow.ga/api/request/approve/?requestId=${itemInfra[0].requestId}&approver=department&departmentId=${itemInfra[0].departmentId}`;
              }
              await sendEmailRequest(
                { data: itemInfra },
                itemInfra[0].departmentEmail,
                url
              );
            }
            if (itemSRM.length > 0) {
              let url;
              if (config.NODE_ENV === "development") {
                url = `http://localhost:3000/api/request/approve/?requestId=${itemSRM[0].requestId}&approver=department&departmentId=${itemSRM[0].departmentId}`;
              } else {
                url = `http://edborrow.ga/api/request/approve/?requestId=${itemSRM[0].requestId}&approver=department&departmentId=${itemSRM[0].departmentId}`;
              }
              await sendEmailRequest(
                { data: itemSRM },
                itemSRM[0].departmentEmail,
                url
              );
            }
            if (itemLAB.length > 0) {
              let url;
              if (config.NODE_ENV === "development") {
                url = `http://localhost:3000/api/request/approve/?requestId=${itemLAB[0].requestId}&approver=department&departmentId=${itemLAB[0].departmentId}`;
              } else {
                url = `http://edborrow.ga/api/request/approve/?requestId=${itemLAB[0].requestId}&approver=department&departmentId=${itemLAB[0].departmentId}`;
              }
              await sendEmailRequest(
                { data: itemLAB },
                itemLAB[0].departmentEmail,
                url
              );
            }

            printlog("Green", "Success sending email to the department");
            res.redirect("https://edborrow.netlify.com/#/approve/type/success");
          }
        } else {

          approvedRequest = await requests.advisorAllApprove(req.query);
          rejectAdvisorApproveItem = await requests.rejectAllRequest(
            req.query,
            (type = "advisor")
          );
          printlog("Yellow", "Advisor Reject the request");
          res.redirect(
            `https://edborrow.netlify.com/#/approve/type/fail?requestId=${req.query.requestId}`
          );
        }
      }
    } else {
      if (req.query.status === "TRUE") {
        approvedRequest = await requests.departmentAllApprove(req.query);

        printlog("Green", "Department Approve the request");
        res.redirect("https://edborrow.netlify.com/#/approve/type/success");
      } else {
        approvedRequest = await requests.departmentAllApprove(req.query);
        rejectApproveItem = await requests.rejectAllRequest(
          req.query,
          (type = "department")
        );
        printlog("Yellow", "Department Reject the request");

        res.redirect("https://edborrow.netlify.com/#/approve/type/fail");
      }
    }
  } catch (err) {
    printlog("Red", err);
    next(err);
  }
};

exports.getRequestList = async (req, res, next) => {
  try {
    let requestList = await requests.getRequestList(
      res.locals.authData.user[0].userId
    );

    res.status(200).json({ result: "success", data: requestList });
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: "false", msg: err });
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
    res.status(500).json({ result: "false", msg: err });
  }
};

exports.getRequestItemAdmin = async (req, res, next) => {
  try {
    let data = [];

    let role = await getUserRole(res.locals.authData.user[0].userId);

    let itemonUser = await requests.getRequestItemAdmin(
      res.locals.authData.user[0].userId,
      "user"
    );
    data = [...data, ...itemonUser];
    let itemonDepartment = await requests.getRequestItemAdmin(
      role[0],
      "department"
    );

    data = [...data, ...itemonDepartment];

    res.status(200).json({ result: "success", data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: "false", msg: err });
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
    printlog('Yellow', "Add reject Purpose")
    res.status(200).json({ result: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: "false", msg: err });
  }
};
