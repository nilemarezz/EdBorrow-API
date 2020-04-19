const aws = require("aws-sdk");
const multer = require("multer");
const multers3 = require("multer-s3");
const config = require("../config.json");
const path = require("path");
aws.config.update({
  accessKeyId: config.ACCESSKEY_ID,
  secretAccessKey: config.ACCESSKEY_SECRET,
  region: "ap-south-1",
});

const s3 = new aws.S3();

var upload = multer({
  storage: multers3({
    s3: s3,
    bucket: "equipment-image",
    acl: "public-read",

    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
});

module.exports = upload;
