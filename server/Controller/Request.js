const RequestModel = require("../Model/Request");
const { sendEmailRequest } = require("../Controller/Email");
const requests = new RequestModel();
const config = require("../config.json");
const printlog = require("../config/logColor");
const jwt = require("jsonwebtoken");
exports.postCreateRequest = async (req, res, next) => {
  try {
    let borrowRequest = await requests.createRequest(req.body);
    let url;
    if (config.NODE_ENV === "development") {
      url = `http://localhost:3000/api/request/approve?requestId=${borrowRequest[0].requestId}&approver=advisor`;
    } else {
      url = `http://18.141.147.137/api/request/approve?requestId=${borrowRequest[0].requestId}&approver=advisor`;
    }
    await sendEmailRequest(
      { data: borrowRequest },
      borrowRequest[0].advisorEmail,
      url
    );
    res
      .status(200)
      .json({ result: "success", msg: "[Email] sent request success" });
  } catch (err) {
    res.status(500).json({ result: "false", msg: err });
    next(err);
  }
};

exports.advisorApprove = async (req, res, next) => {
  try {
    let borrowRequest;
    borrowRequest = await requests.getRequest(req.query.requestId);

    if (borrowRequest[0].requestApprove === 2) {
      let approvedRequest;

      if (req.query.approver === "advisor") {
        if (req.query.status === "TRUE") {
          approvedRequest = await requests.advisorApprove(req.query);

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
                url = `http://18.141.147.137/api/request/approve/?requestId=${itemInfra[0].requestId}&approver=department&departmentId=${itemInfra[0].departmentId}`;
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
                url = `http://18.141.147.137/api/request/approve/?requestId=${itemSRM[0].requestId}&approver=department&departmentId=${itemSRM[0].departmentId}`;
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
                url = `http://18.141.147.137/api/request/approve/?requestId=${itemLAB[0].requestId}&approver=department&departmentId=${itemLAB[0].departmentId}`;
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
          approvedRequest = await requests.advisorApprove(req.query);

          printlog("Yellow", "Advisor Reject the request");
          res.redirect("https://edborrow.netlify.com/#/approve/type/fail");
        }
      } else {
        if (req.query.status === "TRUE") {
          approvedRequest = await requests.departmentApprove(req.query);

          printlog("Green", "Department Approve the request");
          res.redirect("https://edborrow.netlify.com/#/approve/type/success");
        } else {
          approvedRequest = await requests.departmentApprove(req.query);
          printlog("Yellow", "Department Reject the request");

          res.redirect("https://edborrow.netlify.com/#/approve/type/fail");
        }
      }
    } else {
      printlog("Yellow", "Already Approve the Request");

      res.redirect(
        `https://edborrow.netlify.com/#/approve/type/already?requestId=${borrowRequest[0].requestId}`
      );
    }
  } catch (err) {
    printlog("Red", err);
    next(err);
  }
};

exports.putDepartmentApprove = async (req, res, next) => {
  try {
  } catch (err) {
    res.status(500).json({ result: "false", msg: err });
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
    let requestItem = await requests.getRequestItem(req.params.requestId);
    res.status(200).json({ result: "success", data: requestItem });
  } catch (err) {
    res.status(500).json({ result: "false", msg: err });
  }
};
