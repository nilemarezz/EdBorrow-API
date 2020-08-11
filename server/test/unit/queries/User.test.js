const { expect } = require('chai')
const { ASSIGN_ROLE, CHANGE_PASSWORD, CREATE_USER, GET_LOGIN, GET_PASSWORD,
  GET_USER_BY_ID, GET_USER_DETAIL, USER_ROLE } = require('../../../Model/queries/User')

describe('/queries/User', () => {
  describe('GET_USER_DETAIL', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `SELECT u.* , CONCAT(a.firstName , " " , a.lastName) as advisorName
  FROM Users u left join Users a on a.userId = u.studentAdvisor
  WHERE u.userId = '1';`

      expect(GET_USER_DETAIL(1)).to.equal(expectedqueries)
    })
  })
  describe('ASSIGN_ROLE', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `INSERT INTO UserRole values ('1' , 10) `

      expect(ASSIGN_ROLE(1)).to.equal(expectedqueries)
    })
  })
  describe('CHANGE_PASSWORD', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `UPDATE Users SET password = '123' WHERE userId = '1'`

      expect(CHANGE_PASSWORD(1, 123)).to.equal(expectedqueries)
    })
  })
  describe('CREATE_USER', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `
  INSERT INTO Users (userId, password, email, firstName, lastName, userTelNo , studentAdvisor) 
  VALUES ("1", "2", "1", "3", "4" , "5" , "testAdvisor");
`

      expect(CREATE_USER(1, 2, 3, 4, 5)).to.equal(expectedqueries)
    })
  })
  describe('GET_LOGIN', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `SELECT userId,firstName,password FROM Users WHERE userId = '1';`

      expect(GET_LOGIN(1)).to.equal(expectedqueries)
    })
  })
  describe('GET_PASSWORD', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `SELECT password FROM Users u WHERE userId = '1' `

      expect(GET_PASSWORD(1)).to.equal(expectedqueries)
    })
  })
  describe('GET_USER_BY_ID', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `SELECT *
  FROM Users
  WHERE userId = '1';`

      expect(GET_USER_BY_ID(1)).to.equal(expectedqueries)
    })
  })


})