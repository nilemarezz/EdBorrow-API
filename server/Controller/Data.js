const checkDepartmentId = require("../Utilities/checkDepartmentId")
const { getLastestBorrow, getMostBorrow } = require('../Model/Data')
exports.Dashboard = async (req, res, next) => {
  try {
    const admin = await checkDepartmentId(res.locals.authData.user[0].userId)
    console.log(admin)
    const lastestBorrow = await getLastestBorrow(admin, res.locals.authData.user[0].userId)
    const mostBorrow = await getMostBorrow(admin, res.locals.authData.user[0].userId)
    const data = {
      lastestBorrow,
      mostBorrow
    }
    res.status(500).json({ result: 'success', data: data });
  } catch (err) {
    console.log(err)
    res.status(500).json({ result: 'false', msg: err });
  }
}