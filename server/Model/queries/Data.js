const GET_LASTEST_BORROW = (department, user) => {
  const departmentQuery = `
  SELECT ri.transactionDate  , i.itemName, i.itemImage FROM RequestItem ri 
  JOIN Items i ON i.itemId  = ri.itemId 
  WHERE i.departmentId = "${department}" 
  and ri.itemApprove = 1
  ORDER BY ri.transactionDate DESC  
  LIMIT 3;  
  `
  const userQuery = `
  SELECT ri.transactionDate  , i.itemName , i.itemImage FROM RequestItem ri 
  JOIN Items i ON i.itemId  = ri.itemId 
  WHERE i.userId = "${user}" 
  and ri.itemApprove = 1
  ORDER BY ri.transactionDate DESC  
  LIMIT 3;  
  `

  if (department === false) {
    return userQuery
  } else {
    return departmentQuery
  }
}

const GET_MOST_BORROW = (department, user) => {
  const departmentQuery = `
  SELECT i.itemName , COUNT(*) AS Count
  FROM RequestItem ri JOIN Items i on ri.itemId = i.itemId 
  WHERE i.departmentId = "${department}" 
  and ri.itemApprove = 1 
  GROUP BY i.itemId 
  ORDER BY Count DESC
  Limit 5;
  `
  const userQuery = `
  SELECT i.itemName , COUNT(*) AS Count
  FROM RequestItem ri JOIN Items i on ri.itemId = i.itemId 
  WHERE i.userId = "${user}"
  and ri.itemApprove = 1 
  GROUP BY i.itemId 
  ORDER BY Count DESC
  Limit 5;
  `
  if (department === false) {
    return userQuery
  } else {
    return departmentQuery
  }
}

const GET_REQUEST_STATUS = (department, user, type) => {
  return `
  select count(*) as count from RequestItem ri 
  join Items i on i.itemId = ri.itemId 
  join BorrowRequest br on br.requestId = ri.requestId 
  where ${type === "waiting" ? "ri.itemApprove = 2" : "ri.itemBorrowingStatusId = 3"} and ${department === false ? `i.userId = "${user}"` : `i.departmentId = ${department}`} 
  and br.requestApprove = 1;
  `
}

const COUNT_ITEMS = (department, user) => {
  return `
  select count(*) as count from Items i 
  where ${department === false ? `i.userId = "${user}"` : `i.departmentId = ${department};`}
  `
}

const COUNT_BY_MONTH = (department, user) => {
  return `SELECT MONTHNAME(ri.transactionDate ) month , COUNT(*) AS Count from RequestItem ri 
  join Items i on i.itemId = ri.itemId 
  where ${department === false ? `i.userId = "${user}"` : `i.departmentId = ${department}`}
  and ri.itemApprove = 1;
  `
}

const USER_ACTION_LOG = (userId, action, toComplete) => {
  return `INSERT INTO UserActionLog (userId, userAction , toComplete) values('${userId}' ,'${action}', ${toComplete});`
}

module.exports = { GET_LASTEST_BORROW, GET_MOST_BORROW, GET_REQUEST_STATUS, COUNT_ITEMS, COUNT_BY_MONTH, USER_ACTION_LOG }