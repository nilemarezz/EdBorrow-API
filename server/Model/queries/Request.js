const GET_REQUEST = (requestId) => {
  return `SELECT * FROM BorrowRequest WHERE requestId = ${requestId}`
}
const GET_REQUEST_ITEM = (requestId) => {
  return `SELECT ri.* , i.* 
  FROM BorrowRequest br join RequestItem ri on br.requestId = ri.requestId 
  join Items i on ri.itemId = i.itemId 
  WHERE br.requestId = ${requestId};`
}
const GET_REQUEST_LIST = (userId) => {
  return `SELECT br.*, u.firstName , u.*
  FROM BorrowRequest br left join Users u on br.userId = u.userId
  WHERE br.userId = '${userId}';
  `
}
const GET_REQUEST_ADMIN = (id, type) => {
  return `select * from RequestItem ri join Items i on ri.itemId = i.itemId join BorrowRequest b ON 
    b.requestId  = ri.requestId where ${
    type === "user" ? `i.userId` : `i.departmentId`
    }  = "${id}" and b.requestApprove = 1`
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
    INSERT_ITEMREQUEST_TO_DB: (body, lastInsertId, i) =>
      `INSERT INTO RequestItem (requestId , itemId, borrowDate , returnDate ) 
    VALUES(${lastInsertId}, ${body.items[i].itemId} , '${body.personalInformation.borrowDate}', '${body.personalInformation.returnDate}');`,
    UPDATE_ITEM_AVALIBILITY: (body, i) =>
      `UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
    SET ri.itemBorrowingStatusId = 4 , i.itemAvailability = FALSE WHERE ri.itemId = ${body.items[i].itemId};`,
    RETURN_REQUEST: (lastInsertId) => `
    SELECT br.requestId , br.userId , CONCAT(u.firstName , " ", u.lastName) as Name , u.curriculum , u.email , u.studentYear , u.userTelNo , 
    i.itemName ,i.departmentId , i.userId , d.departmentId , br.borrowPurpose , br.usePlace , ri.returnDate , ri.borrowDate , a.userId as studentAdvisor, a.email as advisorEmail 
    FROM BorrowRequest br join RequestItem ri on br.requestId = ri.requestId 
    join Items i on ri.itemId = i.itemId 
    join ItemDepartment d on i.departmentId = d.departmentId 
    left join Users u on br.userId = u.userId 
    inner join Users a on a.userId = u.studentAdvisor 
    WHERE br.requestId = ${lastInsertId};`
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
		      i.itemId , i.itemName , d.departmentId , d.departmentName , d.departmentEmail , br.borrowPurpose , br.usePlace , ri.returnDate , ri.borrowDate , 
		      a.userId as studentAdvisor, CONCAT(a.firstName, " ", a.lastName) as advisorName, a.email as advisorEmail , br.requestApprove 
    FROM BorrowRequest br join RequestItem ri on br.requestId = ri.requestId 
					join Items i on ri.itemId = i.itemId 
					left join Users u on br.userId = u.userId 
					inner join Users a on a.userId = u.studentAdvisor 
					join ItemDepartment d on i.departmentId = d.departmentId 
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
  DEPARTMENT_APPROVE_EACH_ITEM, DEPARTMENT_CHANGE_STATUS, CREATE_REQUEST, GET_REQUEST, GET_REQUEST_ITEM,
  GET_REQUEST_LIST, ADVISOR_CHANGE_REQUEST_STATUS, DEPARTMENT_CHANGE_REQUEST_STATUS,
  REJECT_ALL_REQUEST, GET_REQUEST_ADMIN, SET_REJECT_PURPOSE
}