const GET_ALL_ITEM = () => {
  return `
  SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage , its.itemStatusTag  
  FROM Items i left join ItemDepartment d on i.departmentId = d.departmentId 
        join ItemCategory c on i.categoryId = c.categoryId 
        join itemStatus its on i.itemStatusId = its.itemStatusId 
  ORDER BY i.itemName asc;
  `
}
const GET_ITEM_BY_ID = (id, department) => {
  const departmentQuery = `
  SELECT i.*, id.departmentName, id.departmentTelNo, id.departmentEmail, its.itemStatusTag , dp.* from Items i join ItemDepartment id  on id.departmentId  = i.departmentId 
  join  DepartmentPlace dp on id.placeId  = dp.placeId 
  join itemStatus its on i.itemStatusId = its.itemStatusId 
  WHERE i.itemId = ${id};`
  const userQuery = `
  select i.* ,u.email , u.userTelNo , CONCAT(u.firstName , " ", u.lastName) AS Name , its.itemStatusTag 
  from Items i join Users u on i.userId  = u.userId 
  join itemStatus its on i.itemStatusId = its.itemStatusId 
  where i.itemId = ${id} ;
  `
  if (department === false) {
    return userQuery
  } else {
    return departmentQuery
  }
}
const GET_CATEGORY = () => {
  return `
  SELECT DISTINCT categoryName FROM ItemCategory;
  `
}
const GET_DEPARTMENT = () => {
  return `
  SELECT DISTINCT departmentName FROM ItemDepartment;
  `
}
const GET_OWNER = () => {
  return `
  SELECT DISTINCT u.firstName as 'ownerName'
  FROM Items i join Users u ON i.userId = u.userId 
  WHERE i.userId IS NOT NULL;
  `
}
const DELETE_ALL_ITEMS = () => {
  return `
  DELETE FROM Items;
  `
}
const DELETE_ITEM_BY_ID = (itemId) => {
  return `
  DELETE FROM Items 
  WHERE itemId = ${itemId};`
}
const ADD_ITEM = (value) => {
  return `
  INSERT INTO Items (itemBrand ,itemModel , itemName, createDate ,categoryId ,${value.departmentId === 'null' ? "userId" : "departmentId"} ,itemStatusId ,itemImage ,itemDescription ,itemBorrowable ,itemAvailability ) 
  values ('${value.itemBrand}','${value.itemModel}','${value.itemName}','${value.createDate}',1,'${value.departmentId === 'null' ? value.userId : value.departmentId}',1,${value.itemImage === null ? 'NULL' : `'${value.itemImage}'`},'${value.itemDescription}',1,1) 
  `
}
const GET_UN_AVAILABLE_ITEM = (value) => {
  return `
  SELECT ri.requestId , ri.itemId , DATE_ADD(ri.borrowDate, INTERVAL 1 DAY) as borrowDate , DATE_ADD(ri.returnDate, INTERVAL 1 DAY) as returnDate
  FROM Items i LEFT JOIN RequestItem ri ON i.itemId = ri.itemId 
  WHERE ri.itemId = ${value} AND ri.returnDate >= CURRENT_DATE();
  `
}
const GET_DEPARTMENT_BY_ID = (userId, department) => {
  const departmentQuery =
    `
  SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.createDate , ist.itemStatusTag , i.userId as ownerName , i.itemAvailability , i.itemImage 
  FROM Items i left join ItemDepartment d on i.departmentId = d.departmentId 
  join ItemCategory c on i.categoryId = c.categoryId 
  join itemStatus ist on ist.itemStatusId  = i.itemStatusId 
  where i.departmentId = "${department}" ORDER BY i.itemName asc
  `
  const userQuery =
    `
  SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.createDate , ist.itemStatusTag  , i.userId as ownerName , i.itemAvailability , i.itemImage 
  FROM Items i left join ItemDepartment d on i.departmentId = d.departmentId 
  join ItemCategory c on i.categoryId = c.categoryId 
  join itemStatus ist on ist.itemStatusId  = i.itemStatusId 
  where i.userId = "${userId}" ORDER BY i.itemName asc
  `
  if (department === false) {
    return userQuery
  } else {
    return departmentQuery
  }
}
const UPDATE_ITEM = (value, department, userId) => {
  const departmentQuery = `
  UPDATE Items 
  SET itemName = "${value.itemName}", itemBrand = "${value.itemBrand}" , itemModel = "${value.itemModel}", itemStatusId = "${value.itemStatusId}" ,categoryId = "${value.categoryId}", itemDescription = "${value.itemDescription}" ${value.itemImage === null ? '' : `, itemImage = "${value.itemImage}"`} 
  WHERE itemId = ${value.itemId} AND departmentId  = ${department}`
  const userQuery = `
  UPDATE Items 
  SET itemName = "${value.itemName}", itemBrand = "${value.itemBrand}" , itemModel = "${value.itemModel}", itemStatusId = "${value.itemStatusId}"  ,categoryId = "${value.categoryId}", itemDescription = "${value.itemDescription}" ${value.itemImage === null ? '' : `, itemImage = "${value.itemImage}"`} 
  WHERE itemId = ${value.itemId} AND userId  = "${userId}"`
  if (department === false) {
    return userQuery
  } else {
    return departmentQuery
  }

}

const GET_MY_BORROW_ITEM = (isDepartment, user) => {
  const departmentQuery = `
  select i.itemName  , i.itemImage , ri.itemBorrowingStatusId , ri.returnDate , i.itemId , id.departmentName as Owner
  from BorrowRequest br join RequestItem ri on br.requestId = ri.requestId
  join Items i on i.itemId = ri.itemId 
  join ItemDepartment id on id.departmentId = i.departmentId 
  where (br.userId = "${user}")
  and (ri.itemBorrowingStatusId = 1 or ri.itemBorrowingStatusId = 3 or ri.itemBorrowingStatusId = 6)
  and i.userId is null;`
  const userQuery = `
  select i.itemName  , i.itemImage , ri.itemBorrowingStatusId , ri.returnDate , i.itemId , 
  CONCAT(u2.firstName , " ", u2.lastName) AS Owner 
  from BorrowRequest br join RequestItem ri on br.requestId = ri.requestId
  join Items i on i.itemId = ri.itemId 
  join Users u2 on u2.userId = i.userId 
  where (br.userId = "${user}") 
  and i.userId is not null;`
  if (isDepartment) {
    return departmentQuery
  } else {
    return userQuery
  }

}

module.exports = {
  GET_ALL_ITEM, GET_ITEM_BY_ID, GET_CATEGORY, GET_UN_AVAILABLE_ITEM, GET_DEPARTMENT, GET_OWNER,
  DELETE_ALL_ITEMS, ADD_ITEM, DELETE_ITEM_BY_ID, GET_DEPARTMENT_BY_ID, UPDATE_ITEM, GET_MY_BORROW_ITEM
}