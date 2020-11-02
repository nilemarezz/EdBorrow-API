const { expect } = require('chai')
const { ASSIGN_ROLE, CHANGE_PASSWORD, CREATE_USER, GET_LOGIN, GET_PASSWORD,
  GET_USER_BY_ID, GET_USER_DETAIL, USER_ROLE, GET_ADVISOR_LIST } = require('../../Model/queries/User')

describe('/queries/User', () => {
  describe('GET_USER_DETAIL', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `SELECT u.userId ,u.firstName ,u.lastName ,u.email , CONCAT(a.firstName , " " , a.lastName) as advisorName, u.userTelNo 
  FROM Users u left join Users a on a.userId = u.studentAdvisor
  WHERE u.userId = '1'`
      expect(GET_USER_DETAIL(1)).to.equal(expectedqueries)
    })
  })
  describe('ASSIGN_ROLE', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `INSERT INTO UserRole values ('1' , 10) `
      expect(ASSIGN_ROLE(1, 10)).to.equal(expectedqueries)
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
  INSERT INTO Users (userId, email, firstName, lastName) 
  VALUES ('1', "2", "3", "4" )
`
      expect(CREATE_USER(1, 2, 3, 4, 5, 6)).to.equal(expectedqueries)
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
  describe('USER_ROLE', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `select ur.roleId from UserRole ur where userId = "1" `
      expect(USER_ROLE(1)).to.equal(expectedqueries)
    })
  })
  describe('GET_ADVISOR_LIST', () => {
    it('should return the string same as expected queries', () => {
      const expectedqueries = `SELECT u.userId , CONCAT(u.firstName , " ", u.lastName) as Name , u.email FROM Users u JOIN UserRole ur ON u.userId = ur.userId WHERE ur.roleId = 20`
      expect(GET_ADVISOR_LIST()).to.equal(expectedqueries)
    })
  })
})