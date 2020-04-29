const nodemailer = require("nodemailer");
const AWS = require("aws-sdk");
const config = require("../config.json");
const printlog = require('../config/logColor')
exports.sendEmailUser = async (email,password) => {
  try {
    printlog("Magenta",`Send mail to ${email}`)

    AWS.config.update({
      accessKeyId: config.ACCESSKEY_ID,
      secretAccessKey: config.ACCESSKEY_SECRET,
      region: "ap-south-1"
    });

    // create Nodemailer SES transporter
    let transporter = nodemailer.createTransport({
      SES: new AWS.SES({
        apiVersion: "2010-12-01"
      })
    });

    // send some mail
    let info = await transporter.sendMail({
      from: '"[User detail]" <equipmentproject63@gmail.com>',
      to: email,
      subject: "Register Success",
      html: `<h2>EdBorrow</h2><br>
              <b>Email : ${email}</b><br>
              <b>Password: ${password}</b>`
    });
    console.log(info.messageId);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
