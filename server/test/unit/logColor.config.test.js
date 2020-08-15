var expect = require('chai').expect;
require('mocha-sinon');
const colorLog = require('../../config/logColor')

describe('logColor()', function () {

  beforeEach(function () {
    this.sinon.stub(console, 'log');
  });

  describe('use Blue backgroung and text "log" ', function () {
    it('should log with color correctly', function () {
      colorLog("Blue", "log");
      expect(console.log.calledOnce).to.be.true;
      expect(console.log.calledWith("\x1b[44m", "\x1b[30m", "log", "\x1b[0m")).to.be.true;
    });
  })
})