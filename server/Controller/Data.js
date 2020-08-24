const checkDepartmentId = require("../Utilities/checkDepartmentId")
const { getLastestBorrow, getMostBorrow, getWaitingRequest, countItems, countByMonth } = require('../Model/Data')
const pool = require('../config/BorrowSystemDB')
exports.Dashboard = async (req, res, next) => {
  try {
    const admin = await checkDepartmentId(res.locals.authData.user[0].userId)
    const lastestBorrow = await getLastestBorrow(admin, res.locals.authData.user[0].userId)
    const mostBorrow = await getMostBorrow(admin, res.locals.authData.user[0].userId)
    const waiting = await getWaitingRequest(admin, res.locals.authData.user[0].userId, "waiting")
    const late = await getWaitingRequest(admin, res.locals.authData.user[0].userId, "late")
    const items = await countItems(admin, res.locals.authData.user[0].userId)
    const countmonth = await countByMonth(admin, res.locals.authData.user[0].userId)
    const data = {
      lastestBorrow,
      mostBorrow,
      countmonth,
      waiting: waiting[0].count,
      late: late[0].count,
      items: items[0].count
    }
    res.status(500).json({ result: 'success', data: data });
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: 'false', msg: err });
  }
}

exports.DepartmentList = async (req, res, next) => {
  try {
    const department = await pool.query('SELECT departmentId , departmentName FROM ItemDepartment')
    res.status(200).json({ result: 'success', data: department });
  } catch (err) {
    res.status(500).json({ result: 'false', msg: err });
  }
}