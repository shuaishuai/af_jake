var _ = require('lodash'),
    q = require('q'),
    moment = require('moment');

var models = require('../../models'),
    CronTab = models.CronTab;


var JOBS = {
  'bd1e98c0-6ddc-11e3-88e6-08002708e90e': require('./job_eastmoney_report_content'),
};

module.exports = {
  excuteJob: function () {
    var d = q.defer();

    CronTab.getJob()
      .then(function (job) {
        if (job) {
          if (job.uuid in JOBS) {
            JOBS[job.uuid]()
              .then(function (message) {
                job.last_attempt = Date.now();
                job.save()
                  .success(function () {
                    if ('warning' in message) {
                      d.resolve({ warning: job.name + ', ' + message.warning });
                    } else if ('success' in message) {
                      d.resolve({ success: job.name + ', ' + message.success });
                    } else {
                      d.reject('NotImplementedException');
                    }
                  })
                  .error(function (error) {
                    // FIXME: what is the error?
                    console.log(error);
                    d.reject('job.save');
                  });
              })
              .fail(function (errorText) {
                d.reject(errorText);
              })
              .done();
          } else {
            d.reject('invalid job uuid');
          }
        } else {
          d.resolve({ warning: 'no expired job' });
        }
      })
      .fail()
      .done();

    return d.promise;
  }
};


// Status     Q          Message      Res.Send       Logentries
// ----------------------------------------------------------------
// success    resolve    {success}    textSuccess    info
// no job     resolve    {warning}    textWarning    warn
// warning    resolve    {warning}    textWarning    warn
// error      reject     errorText    textError      error