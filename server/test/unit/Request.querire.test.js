const { ADVISOR_CHANGE_REQUEST_STATUS, CREATE_REQUEST, DEPARTMENT_APPROVE_EACH_ITEM, DEPARTMENT_CHANGE_REQUEST_STATUS
  , DEPARTMENT_CHANGE_STATUS, GET_REQUEST, GET_REQUEST_ADMIN, GET_REQUEST_ITEMS, GET_REQUEST_LIST, REJECT_ALL_REQUEST,
  SET_REJECT_PURPOSE } = require('../../Model/queries/Request')
const { expect } = require('chai')

const query = {
  requestId: 1
}
const summaryForm = {
  items: [{ itemId: 1 }],
  personalInformation: {
    borrowDate: 1,
    borrowPurpose: 2,
    name: `3`,
    returnDate: 4,
    transactionDate: 5,
    usePlace: 6,
    userId: 7
  }
}
const approve = {
  itemApprove: 1,
  requestId: 1,
  itemId: 1,
  departmentId: 1,
}
const changeStatus = {
  itemBorrowingStatusId: 1,
  requestId: 1,
  itemId: 1
}
const lastInsertId = 1
describe('/queries/Request', () => {
  describe('ADVISOR_CHANGE_REQUEST_STATUS', () => {
    describe('APPROVE_ALL_APPROVE', () => {
      it('should return the string same as expected queries', () => {
        const expectedqueries = `UPDATE BorrowRequest SET requestApprove = TRUE WHERE requestId = 1;`
        expect(ADVISOR_CHANGE_REQUEST_STATUS(query).APPROVE_ALL_APPROVE).to.equal(expectedqueries)
      })
    })
    describe('APPROVE_ALL_APPROVE', () => {
      it('should return the string same as expected queries', () => {

        const expectedqueries = `UPDATE BorrowRequest br join RequestItem ri on br.requestId = ri.requestId 
    join Items i on ri.itemId = i.itemId 
    SET br.requestApprove = FALSE, ri.itemBorrowingStatusId = NULL, i.itemAvailability = TRUE 
    WHERE br.requestId = 1;`
        expect(ADVISOR_CHANGE_REQUEST_STATUS(query).REJECT_ALL_APPROVE).to.equal(expectedqueries)
      })
    })
    describe('RETURN_REQUEST', () => {
      it('should return the string same as expected queries', () => {

        const expectedqueries = `
    SELECT br.requestId , br.userId , CONCAT(u.firstName , " ", u.lastName) as Name , u.curriculum , u.email , u.studentYear , u.userTelNo , 
		      i.itemId , i.itemName , d.departmentId , d.departmentName , d.departmentEmail , br.borrowPurpose , br.usePlace , ri.returnDate , ri.borrowDate , 
		      a.userId as studentAdvisor, CONCAT(a.firstName, " ", a.lastName) as advisorName, a.email as advisorEmail , br.requestApprove 
    FROM BorrowRequest br join RequestItem ri on br.requestId = ri.requestId 
					join Items i on ri.itemId = i.itemId 
					left join Users u on br.userId = u.userId 
					inner join Users a on a.userId = u.studentAdvisor 
					join ItemDepartment d on i.departmentId = d.departmentId 
    WHERE br.requestId = 1;
    `
        expect(ADVISOR_CHANGE_REQUEST_STATUS(query).RETURN_REQUEST).to.equal(expectedqueries)
      })
    })
  })
  describe('CREATE_REQUEST', () => {
    describe('INSERT_BORROWREQUEST_TO_DB', () => {
      const expectedqueries = `INSERT INTO BorrowRequest (userId , borrowPurpose , usePlace) 
    VALUES('7' , '2' , '6');`
      expect(CREATE_REQUEST().INSERT_BORROWREQUEST_TO_DB(summaryForm, lastInsertId, 1)).to.equal(expectedqueries)
    })
    describe('INSERT_ITEMREQUEST_TO_DB', () => {
      const expectedqueries = `INSERT INTO RequestItem (requestId , itemId, borrowDate , returnDate ) 
    VALUES(1, 1 , '1', '4');`
      expect(CREATE_REQUEST().INSERT_ITEMREQUEST_TO_DB(summaryForm, lastInsertId, 0)).to.equal(expectedqueries)
    })
    describe('UPDATE_ITEM_AVALIBILITY', () => {
      const expectedqueries = `UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
    SET ri.itemBorrowingStatusId = 4 , i.itemAvailability = FALSE WHERE ri.itemId = 1;`
      expect(CREATE_REQUEST().UPDATE_ITEM_AVALIBILITY(summaryForm, 0)).to.equal(expectedqueries)
    })
  })
  describe('DEPARTMENT_APPROVE_EACH_ITEM', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `
  UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
  SET ri.itemApprove = ${approve.itemApprove} , ri.itemBorrowingStatusId = ${
        approve.itemApprove === 1 ? 6 : 5
        } , i.itemAvailability = ${approve.itemApprove === 1 ? "FALSE" : "TRUE"}
  WHERE (ri.requestId = ${approve.requestId} AND ri.itemId = ${
        approve.itemId
        }) AND i.itemId = ${approve.itemId};
`
      expect(DEPARTMENT_APPROVE_EACH_ITEM(approve)).to.equal(expectedqueries)

    })
  })
  describe('DEPARTMENT_CHANGE_STATUS', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `
  UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
  SET ri.itemBorrowingStatusId = 1 
  WHERE (ri.requestId = 1 AND ri.itemId = 1) AND i.itemId = 1;
`
      expect(DEPARTMENT_CHANGE_STATUS(changeStatus)).to.equal(expectedqueries)

    })
  })
  describe('DEPARTMENT_CHANGE_REQUEST_STATUS', () => {
    describe('DEPARTMENT_ALL_APPROVE', () => {
      it('should return the string same as expected queries', () => {
        const expectedqueries = `UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
      SET ri.itemApprove = TRUE , ri.itemBorrowingStatusId = 6 , i.itemAvailability = FALSE 
      WHERE ri.requestId = 1 AND i.departmentId = 1;`
        expect(DEPARTMENT_CHANGE_REQUEST_STATUS({ requestId: 1, departmentId: 1 }).DEPARTMENT_ALL_APPROVE).to.equal(expectedqueries)
      })
    })
    describe('DEPARTMENT_ALL_REJECT', () => {
      it('should return the string same as expected queries', () => {
        const expectedqueries = ` UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
    SET ri.itemApprove = FALSE , ri.itemBorrowingStatusId = 5 , i.itemAvailability = TRUE 
    WHERE ri.requestId = 1 AND i.departmentId = 1;`
        expect(DEPARTMENT_CHANGE_REQUEST_STATUS({ requestId: 1, departmentId: 1 }).DEPARTMENT_ALL_REJECT).to.equal(expectedqueries)
      })
    })
  })
  describe('GET_REQUEST', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `SELECT * FROM BorrowRequest WHERE requestId = 1`
      expect(GET_REQUEST(1)).to.equal(expectedqueries)
    })
  })
  describe('GET_REQUEST_ADMIN', () => {
    describe('department query', () => {
      it('should return the string same as expected queries', () => {
        const depertmentQuery = `
  select ri.borrowDate , b.borrowPurpose , ri.itemApprove , ri.itemBorrowingStatusId , 
  ri.itemId , i.itemName ,ri.requestId ,ri.returnDate ,b.transactionDate ,b.usePlace ,b.userId , CONCAT(u.firstName , " ", u.lastName) as Name 
  from RequestItem ri join Items i on ri.itemId = i.itemId join BorrowRequest b ON 
  b.requestId  = ri.requestId join Users u on u.userId = b.userId 
  where i.departmentId  = "1" and b.requestApprove = 1`
        expect(GET_REQUEST_ADMIN("user", 1)).to.equal(depertmentQuery)
      })
    })
    describe('user query', () => {
      it('should return the string same as expected queries', () => {
        const userQuery = `
  select ri.borrowDate , b.borrowPurpose , ri.itemApprove , ri.itemBorrowingStatusId , 
  ri.itemId , i.itemName ,ri.requestId ,ri.returnDate ,b.transactionDate ,b.usePlace ,b.userId , CONCAT(u.firstName , " ", u.lastName) as Name 
  from RequestItem ri join Items i on ri.itemId = i.itemId join BorrowRequest b ON 
  b.requestId  = ri.requestId join Users u on u.userId = b.userId 
  where i.userId = "user" and b.requestApprove = 1`
        expect(GET_REQUEST_ADMIN("user", false)).to.equal(userQuery)
      })
    })
  })
  describe('GET_REQUEST_ITES', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `
  SELECT ri.itemId  , i.itemName , i.itemImage ,ri.itemApprove ,ri.itemBorrowingStatusId ,ri.rejectPurpose , ri.borrowDate  , ri.returnDate 
  FROM RequestItem ri join Items i on i.itemId = ri.itemId WHERE requestId  = "1";
  `
      expect(GET_REQUEST_ITEMS(1)).to.equal(expectedqueries)
    })
  })
  describe('GET_REQUEST_LIST', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `SELECT br.requestId , br.transactionDate , br.requestApprove FROM BorrowRequest br WHERE userId  = "1";`
      expect(GET_REQUEST_LIST(1)).to.equal(expectedqueries)
    })
  })
  describe('REJECT_ALL_REQUEST', () => {
    describe('ADVISOR_REJECT', () => {
      it('should return the string same as expected queries', () => {
        const expectedqueries = `
    UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
    SET ri.itemBorrowingStatusId = 7 , ri.itemApprove = 3 
    WHERE ri.requestId = ${query.requestId}
`
        expect(REJECT_ALL_REQUEST(approve).ADVISOR_REJECT).to.equal(expectedqueries)
      })
    })
    describe('DEPARTMENT_REJECT', () => {
      it('should return the string same as expected queries', () => {
        const expectedqueries = `
    UPDATE RequestItem ri join Items i on ri.itemId = i.itemId 
    SET ri.itemBorrowingStatusId = 5 , ri.itemApprove = 0 
    WHERE ri.requestId = 1 AND i.departmentId = 1
    `
        expect(REJECT_ALL_REQUEST(approve).DEPARTMENT_REJECT).to.equal(expectedqueries)
      })
    })
  })
  describe('SET_REJECT_PURPOSE', () => {
    describe('ADVISOR_SET_PURPOSE', () => {
      const expectedqueries = `UPDATE BorrowRequest set rejectPurpose = "123" where requestId = 1`
      expect(SET_REJECT_PURPOSE(id = 1, text = "123").ADVISOR_SET_PURPOSE).to.equal(expectedqueries)
    })
    describe('DEPARTMENT_SET_PURPOSE', () => {
      const expectedqueries = `UPDATE RequestItem r set r.rejectPurpose = "123" where r.requestId = 1 AND r.itemId = 1`
      expect(SET_REJECT_PURPOSE(id = 1, text = "123", itemId = 1).DEPARTMENT_SET_PURPOSE).to.equal(expectedqueries)
    })
  })
})