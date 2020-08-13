const mailTemplate = require('../../Utilities/EmailService/mailTemplate')
const { expect } = require('chai')

const value = {
  data: [{
    requestId: 1, userId: 1, Name: 'name', email: 'email'
    , userTelNo: 'tel', borrowPurpose: 'date', borrowDate: "0123456789011121314", returnDate: "0123456789011121314",
    itemName: 'itemName'
  }]
}
const url = 'url'
describe("Utilities/EmailService/mailTemplate", () => {
  describe("Render mail template", () => {
    it("shold return html of sending mail", () => {
      expect(mailTemplate(value, url)).to.equal(mailTemplate(value, url))
    })
  })
})