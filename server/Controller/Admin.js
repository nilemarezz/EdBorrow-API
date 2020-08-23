const CryptoJS = require('crypto-js');
const config = require('../config.json')
const pool = require('../config/BorrowSystemDB');
const { addAdmin } = require('../Model/Admin')
const printlog = require('../config/logColor');
exports.addAdmin = async (req, res, next) => {
  try {
    var cipherPassword = CryptoJS.AES
      .encrypt(req.body.password, config.CRYPTO_SECRET_KEY)
      .toString();
    await addAdmin(req.body.userId, req.body.firstname, req.body.lastname, cipherPassword)
    res.status(200).json({ result: 'success', msg: 'Add Admin Success' });
  } catch (err) {
    printlog(
      'Red',
      `Add Admin Fail`
    );
    console.log(err);
    res.status(500).json({ result: 'false', msg: err });
  }
};