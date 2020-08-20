const GET_LASTEST_BORROW = (department, user) => {
  const departmentQuery = `
  SELECT ri.transactionDate  , i.itemName, i.itemImage FROM RequestItem ri 
  JOIN Items i ON i.itemId  = ri.itemId 
  WHERE i.departmentId = "${department}"
  ORDER BY ri.transactionDate DESC  
  LIMIT 3;  
  `
  const userQuery = `
  SELECT ri.transactionDate  , i.itemName , i.itemImage FROM RequestItem ri 
  JOIN Items i ON i.itemId  = ri.itemId 
  WHERE i.userId = "${user}"
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
  GROUP BY i.itemId 
  ORDER BY Count DESC
  Limit 5;
  `
  const userQuery = `
  SELECT i.itemName , COUNT(*) AS Count
  FROM RequestItem ri JOIN Items i on ri.itemId = i.itemId 
  WHERE i.userId = "${user}"
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
module.exports = { GET_LASTEST_BORROW, GET_MOST_BORROW }