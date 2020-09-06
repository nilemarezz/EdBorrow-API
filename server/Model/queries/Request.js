const GET_REQUEST = (requestId) => {
  return `SELECT * FROM BorrowRequest WHERE requestId = ${requestId}`
}
const GET_REQUEST_LIST = (userId) => {
  return `SELECT br.requestId , br.transactionDate , br.requestApprove FROM BorrowRequest br WHERE userId  = "${userId}";`
}
const GET_REQUEST_DETAIL = (requestId, userId) => {
  return `SELECT br.requestId , br.userId ,CONCAT(u.firstName , " " , u.lastName ) AS Name, 
  u.email , u.userTelNo , u.studentAdvisor ,br.transactionDate , br.borrowPurpose, br.rejectPurpose  
  FROM BorrowRequest br join Users u on u.userId = br.userId WHERE br.requestId  = "${requestId}" AND br.userId = "${userId}";
  `
}
const GET_REQUEST_ITEMS = (requestId) => {
  return `
  SELECT ri.itemId  , i.itemName , i.itemImage ,ri.itemApprove ,ri.itemBorrowingStatusId ,ri.rejectPurpose , ri.borrowDate  , ri.returnDate 
  FROM RequestItem ri join Items i on i.itemId = ri.itemId WHERE requestId  = "${requestId}";
  `
}
const GET_REQUEST_ADMIN = (userId, departmentId) => {
  const depertmentQuery = `
  select ri.borrowDate , b.borrowPurpose , ri.itemApprove , ri.itemBorrowingStatusId , 
  ri.itemId , i.itemName ,ri.requestId ,ri.returnDate ,b.transactionDate ,b.usePlace ,b.userId , CONCAT(u.firstName , " ", u.lastName) as Name 
  from RequestItem ri join Items i on ri.itemId = i.itemId join BorrowRequest b ON 
  b.requestId  = ri.requestId join Users u on u.userId = b.userId 
  where i.departmentId  = "${departmentId}" and b.requestApprove = 1`
  const userQuery = `
  select ri.borrowDate , b.borrowPurpose , ri.itemApprove , ri.itemBorrowingStatusId , 
  ri.itemId , i.itemName ,ri.requestId ,ri.returnDate ,b.transactionDate ,b.usePlace ,b.userId , CONCAT(u.firstName , " ", u.lastName) as Name 
  from RequestItem ri join Items i on ri.itemId = i.itemId join BorrowRequest b ON 
  b.requestId  = ri.requestId join Users u on u.userId = b.userId 
  where i.userId = "${userId}" and b.requestApprove = 1`
  if (departmentId === false) {
    return userQuery
  } else {
    return depertmentQuery
  }
}
const DEPARTMENT_APPROVE_EACH_ITEM = (body) => {
  return `
  UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
  SET ri.itemApprove = ${body.itemApprove} , ri.itemBorrowingStatusId = ${
    body.itemApprove === 1 ? 6 : 5
    } , i.itemAvailability = ${body.itemApprove === 1 ? "FALSE" : "TRUE"}
  WHERE (ri.requestId = ${body.requestId} AND ri.itemId = ${
    body.itemId
    }) AND i.itemId = ${body.itemId};
`
}
const DEPARTMENT_CHANGE_STATUS = (body) => {
  return `
  UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
  SET ri.itemBorrowingStatusId = ${body.itemBorrowingStatusId} 
  WHERE (ri.requestId = ${body.requestId} AND ri.itemId = ${body.itemId}) AND i.itemId = ${body.itemId};
`
}

const CREATE_REQUEST = () => {
  return {
    INSERT_BORROWREQUEST_TO_DB: (body) =>
      `INSERT INTO BorrowRequest (userId , borrowPurpose , usePlace) 
    VALUES('${body.personalInformation.userId}' , '${body.personalInformation.borrowPurpose}' , '${body.personalInformation.usePlace}');`,
    INSERT_ITEMREQUEST_TO_DB: (items, lastInsertId, i) =>
      `INSERT INTO RequestItem (requestId , itemId, borrowDate , returnDate ) 
    VALUES(${lastInsertId}, ${items[i].itemId} , '${items[i].borrowDate}', '${items[i].returnDate}');`,
    UPDATE_ITEM_AVALIBILITY: (items, i) =>
      `UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
    SET ri.itemBorrowingStatusId = 4 , i.itemAvailability = FALSE WHERE ri.itemId = ${items[i].itemId};`,
    RETURN_REQUEST: (lastInsertId) => `
    select br.requestId ,u.userId , CONCAT(u.firstName , " ", u.lastName) as Name , u.email , u.userTelNo ,
    br.borrowPurpose , ri.borrowDate , ri.returnDate , i.itemName , br.requestApprove
    from RequestItem ri  
    join BorrowRequest br ON br.requestId  = ri.requestId 
    join Users u on u.userId = br.userId 
    join Items i on i.itemId = ri.itemId 
    where ri.requestId = ${lastInsertId};`
  }
}
const ADVISOR_CHANGE_REQUEST_STATUS = (query) => {
  return {
    APPROVE_ALL_APPROVE: `UPDATE BorrowRequest SET requestApprove = TRUE WHERE requestId = ${query.requestId};`,
    REJECT_ALL_APPROVE: `UPDATE BorrowRequest br join RequestItem ri on br.requestId = ri.requestId 
    join Items i on ri.itemId = i.itemId 
    SET br.requestApprove = FALSE, ri.itemBorrowingStatusId = NULL, i.itemAvailability = TRUE 
    WHERE br.requestId = ${query.requestId};`,
    RETURN_REQUEST: `
    SELECT br.requestId , br.userId , CONCAT(u.firstName , " ", u.lastName) as Name , u.curriculum , u.email , u.studentYear , u.userTelNo , 
          i.itemId , i.itemName , COALESCE(o.email , departmentEmail) as itemOwnerEmail , d.departmentId , d.departmentName , br.borrowPurpose , br.usePlace , ri.returnDate , ri.borrowDate , 
          a.userId as studentAdvisor, CONCAT(a.firstName, " ", a.lastName) as advisorName, a.email as advisorEmail , br.requestApprove 
    FROM BorrowRequest br join RequestItem ri on br.requestId = ri.requestId 
          join Items i on ri.itemId = i.itemId 
          left join Users u on br.userId = u.userId 
          LEFT join Users o on o.userId = i.userId 
          inner join Users a on a.userId = u.studentAdvisor 
          left join ItemDepartment d on i.departmentId = d.departmentId 
    WHERE br.requestId = ${query.requestId};
          `
  }
}
const DEPARTMENT_CHANGE_REQUEST_STATUS = (query) => {
  return {
    DEPARTMENT_ALL_APPROVE: `UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
      SET ri.itemApprove = TRUE , ri.itemBorrowingStatusId = 6 , i.itemAvailability = FALSE 
      WHERE ri.requestId = ${query.requestId} AND i.departmentId = ${query.departmentId};`,
    DEPARTMENT_ALL_REJECT: ` UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
    SET ri.itemApprove = FALSE , ri.itemBorrowingStatusId = 5 , i.itemAvailability = TRUE 
    WHERE ri.requestId = ${query.requestId} AND i.departmentId = ${query.departmentId};`
  }
}
const REJECT_ALL_REQUEST = (query) => {
  return {
    ADVISOR_REJECT: `
    UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
    SET ri.itemBorrowingStatusId = 7 , ri.itemApprove = 3 
    WHERE ri.requestId = ${query.requestId}
`,
    DEPARTMENT_REJECT: `
    UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
    SET ri.itemBorrowingStatusId = 5 , ri.itemApprove = 0 
    WHERE ri.requestId = ${query.requestId} AND i.departmentId = ${query.departmentId}
    `
  }
}
const SET_REJECT_PURPOSE = (id, text, itemId) => {
  return {
    ADVISOR_SET_PURPOSE: `UPDATE BorrowRequest set rejectPurpose = "${text}" where requestId = ${id}`,
    DEPARTMENT_SET_PURPOSE: `UPDATE RequestItem r set r.rejectPurpose = "${text}" where r.requestId = ${id} AND r.itemId = ${itemId}`
  }
}
module.exports = {
  DEPARTMENT_APPROVE_EACH_ITEM, DEPARTMENT_CHANGE_STATUS, CREATE_REQUEST, GET_REQUEST, GET_REQUEST_DETAIL,
  GET_REQUEST_LIST, ADVISOR_CHANGE_REQUEST_STATUS, DEPARTMENT_CHANGE_REQUEST_STATUS,
  REJECT_ALL_REQUEST, GET_REQUEST_ADMIN, SET_REJECT_PURPOSE, GET_REQUEST_ITEMS
}