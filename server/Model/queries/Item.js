const GET_ALL_ITEM = () => {
  return `
  SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage 
  FROM Items i left join ItemDepartment d on i.departmentId = d.departmentId 
        join ItemCategory c on i.categoryId = c.categoryId
  ORDER BY i.itemName asc;
  `
}
const GET_ITEM_BY_ID = (id, department) => {
  const departmentQuery = `
  SELECT i.*, id.departmentName, id.departmentTelNo, id.departmentEmail, dp.* from Items i join ItemDepartment id  on id.departmentId  = i.departmentId 
  join  DepartmentPlace dp on id.placeId  = dp.placeId 
  WHERE i.itemId = ${id};`
  const userQuery = `
  select i.* ,u.email , u.userTelNo , CONCAT(u.firstName , " ", u.lastName) AS Name 
  from Items i join Users u on i.userId  = u.userId where i.itemId = ${id} ;
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
const ADD_ITEM = (value) => {
  return `
  INSERT INTO Items (itemBrand ,itemModel , itemName, createDate ,categoryId ,userId ,itemStatusId ,itemImage ,itemDescription ,itemBorrowable ,itemAvailability ) 
  values ('${value.itemBrand}','${value.itemModel}','${value.itemName}','${value.createDate}',1,'${value.userId}',1,${value.itemImage === null ? 'NULL' : `'${value.itemImage}'`},'${value.itemDescription}',1,1) 
  `
}
const GET_VALID_DATE_ITEM = (value) => {
  return `
  SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId AS ownerName , i.itemAvailability , i.itemImage 
  FROM Items i LEFT JOIN ItemDepartment d ON i.departmentId = d.departmentId 
  WHERE NOT EXISTS (
	SELECT i.itemId FROM Items i LEFT JOIN RequestItem ri2 ON i.itemId = ri2.itemId 
		WHERE i.itemId = ${value.itemId}
			AND '${value.borrowDate}' <= ri2.returnDate 
			AND '${value.returnDate}' >= ri2.borrowDate
	)
  AND i.itemId = ${value.itemId};`
}
const GET_DEPARTMENT_BY_ID = (userId, department) => {
  const departmentQuery =
    `
  SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage 
  FROM Items i left join ItemDepartment d on i.departmentId = d.departmentId 
  join ItemCategory c on i.categoryId = c.categoryId 
  where i.departmentId = "${department}" ORDER BY i.itemName asc
  `
  const userQuery =
    `
  SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage 
  FROM Items i left join ItemDepartment d on i.departmentId = d.departmentId 
  join ItemCategory c on i.categoryId = c.categoryId 
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
  SET itemName = "${value.itemName}", itemBrand = "${value.itemBrand}" , itemModel = "${value.itemModel}", categoryId = "${value.categoryId}", itemDescription = "${value.itemDescription}" ${value.itemImage === null ? '' : `, itemImage = "${value.itemImage}"`} 
  WHERE itemId = ${value.itemId} AND departmentId  = ${department}`
  const userQuery = `
  UPDATE Items 
  SET itemName = "${value.itemName}", itemBrand = "${value.itemBrand}" , itemModel = "${value.itemModel}", categoryId = "${value.categoryId}", itemDescription = "${value.itemDescription}" ${value.itemImage === null ? '' : `, itemImage = "${value.itemImage}"`} 
  WHERE itemId = ${value.itemId} AND userId  = "${userId}"`
  if (department === false) {
    return userQuery
  } else {
    return departmentQuery
  }

}

module.exports = {
  GET_ALL_ITEM, GET_ITEM_BY_ID, GET_CATEGORY, GET_VALID_DATE_ITEM, GET_DEPARTMENT, GET_OWNER,
  DELETE_ALL_ITEMS, ADD_ITEM, GET_DEPARTMENT_BY_ID, UPDATE_ITEM
}