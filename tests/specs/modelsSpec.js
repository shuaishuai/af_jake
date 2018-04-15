var expect = require('chai').expect;

describe('models', function () {
  // this.timeout(5000);

  describe('CronTab', function () {
    var models = require('../../scripts/models'),
        CronTab = models.CronTab;

    it('getJob', function (done){
      CronTab.getJob().then(function (job) {
        expect(job).to.be.a('object');
        // FIXME: beforeEach, insert job.last_attempt = 0, expect.to.be 0
        expect(job.last_attempt).to.be.a('number');
        done();
      });
    });
  });
});