var _ = require('lodash'),
    q = require('q'),
    moment = require('moment');

// var KV = require('../domain/kv');

var models = require('../models'),
    CronTab = models.CronTab;

// var EastMoney = require('../domain/crawlers/eastmoney'),
//     em = new EastMoney(),
//     Ganji = require('../domain/crawlers/ganji'),
//     gj = new Ganji(),
//     ICBC = require('../domain/crawlers/icbc'),
//     icbc = new ICBC();

function _getJob() {
  var d = q.defer();

  var query = {
    where: {
      active: 1,
    }
  };

  CronTab.findAll(query)
    .success(function (ct) {
      var now = Date.now();

      var job = _.find(ct, function (c) {
        var expired = c.last_attempt + c.interval;
        return expired <= now;
      });

      d.resolve(job);
    });

  return d.promise;
}

var JOBS = {
  'bd1e98c0-6ddc-11e3-88e6-08002708e90e': function () {
    return 'hello, job is done';
  },
};

module.exports = {
  excuteJob: function () {
    var d = q.defer();

    _getJob()
      .then(function (job) {
        if (job) {
          if (job.uuid in JOBS) {
            var result = JOBS[job.uuid]();

            job.last_attempt = Date.now();
            job.save()
              .success(function () {
                d.resolve({ success: [job.name, result].join(', ')  });
              })
              .error(function (error) {
                console.log(error);
                d.reject('job.save');
              });
          } else {
            d.reject('invalid job uuid');
          }
        } else {
          d.resolve({ warning: 'no job' });
        }
      })
      .fail()
      .done();

    return d.promise;
  }
};
