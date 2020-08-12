const { ADD_ITEM, DELETE_ALL_ITEMS, GET_ALL_ITEM, GET_CATEGORY, GET_DEPARTMENT, GET_DEPARTMENT_BY_ID, GET_ITEM_BY_ID, GET_OWNER, UPDATE_ITEM } = require('../../../Model/queries/Item');
const { expect } = require('chai')
const item = {
  itemBrand: "a",
  itemModel: "b",
  itemName: "c",
  createDate: "d",
  userId: "e",
  itemImage: "f",
  itemDescription: "g"

}
describe('/queries/Item', () => {
  describe('DELETE_ALL_ITEMS', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `
  DELETE FROM Items;
  `
      expect(DELETE_ALL_ITEMS()).to.equal(expectedqueries);
    });
  })
  describe('ADD_ITEM', () => {
    it('should return the string same as expected queries', () => {

      const expectedqueries = `
  INSERT INTO Items (itemBrand ,itemModel , itemName, createDate ,categoryId ,userId ,itemStatusId ,itemImage ,itemDescription ,itemBorrowable ,itemAvailability ) 
  values ('${item.itemBrand}','${item.itemModel}','${item.itemName}','${item.createDate}',1,'${item.userId}',1,${item.itemImage === null ? 'NULL' : `'${item.itemImage}'`},'${item.itemDescription}',1,1) 
  `
      expect(ADD_ITEM(item)).to.equal(expectedqueries);
    });
  })
  describe('GET_ALL_ITEM', () => {
    it('should return the string same as expected queries', () => {

      const expectedqueries = `
  SELECT i.itemId , i.itemName , i.itemBrand , i.itemModel, d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage 
  FROM Items i left join ItemDepartment d on i.departmentId = d.departmentId 
        join ItemCategory c on i.categoryId = c.categoryId
  ORDER BY i.itemName asc;
  `
      expect(GET_ALL_ITEM()).to.equal(expectedqueries);
    });
  })
  describe('GET_CATEGORY', () => {
    it('should return the string same as expected queries', () => {

      const expectedqueries = `
  SELECT DISTINCT categoryName FROM ItemCategory;
  `
      expect(GET_CATEGORY()).to.equal(expectedqueries);
    });
  })
  describe('GET_DEPARTMENT', () => {
    it('should return the string same as expected queries', () => {

      const expectedqueries = `
  SELECT DISTINCT departmentName FROM ItemDepartment;
  `
      expect(GET_DEPARTMENT()).to.equal(expectedqueries);
    });
  })
  describe('GET_DEPARTMENT_BY_ID', () => {
    it('should return the string same as expected queries', () => {

      const expectedqueries = `
  SELECT i.* , d.departmentName , i.userId as ownerName , i.itemAvailability , i.itemImage 
  FROM Items i left join ItemDepartment d on i.departmentId = d.departmentId 
  join ItemCategory c on i.categoryId = c.categoryId 
  where i.departmentId = "1" ORDER BY i.itemName asc
  `
      expect(GET_DEPARTMENT_BY_ID(1, "department")).to.equal(expectedqueries);
    });
  })
  describe('GET_ITEM_BY_ID', () => {
    it('should return the string same as expected queries', () => {

      const expectedqueries = `
  SELECT i.*, id.departmentName, id.departmentTelNo, id.departmentEmail, dp.* from Items i join ItemDepartment id  on id.departmentId  = i.departmentId 
  join  DepartmentPlace dp on id.placeId  = dp.placeId 
  WHERE i.itemId = 1;`
      expect(GET_ITEM_BY_ID(1)).to.equal(expectedqueries);
    });
  })
  describe('GET_OWNER', () => {
    it('should return the string same as expected queries', () => {

      const expectedqueries = `
  SELECT DISTINCT u.firstName as 'ownerName'
  FROM Items i join Users u ON i.userId = u.userId 
  WHERE i.userId IS NOT NULL;
  `
      expect(GET_OWNER()).to.equal(expectedqueries);
    });
  })
  describe('UPDATE_ITEM', () => {
    it('should return the string same as expected queries', () => {

      const expectedqueries = `
  UPDATE Items 
  SET itemName = "${item.itemName}", itemBrand = "${item.itemBrand}" , itemModel = "${item.itemModel}", categoryId = "${item.categoryId}", itemDescription = "${item.itemDescription}" ${item.itemImage === null ? '' : `, itemImage = "${item.itemImage}"`} 
  WHERE itemId = ${item.itemId}`
      expect(UPDATE_ITEM(item)).to.equal(expectedqueries);
    });
  })
});