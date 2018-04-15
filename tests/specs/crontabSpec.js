var expect = require('chai').expect;

describe.only('CronTab', function () {
  it('CronJob', function (done) {
    // this.timeout(5000);

    var CronJob = require('../../scripts/domain/crons/cronjob');

    expect(CronJob).to.be.a('function');

    var job = new CronJob();
    job
      .then(function (that) {
        expect(that).to.be.a('object');
        expect(that.status).to.equal('ready');
        done();
      });
  });
});
