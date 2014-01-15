var _ = require('lodash'),
    q = require('q'),
    moment = require('moment');

var KV = require('../domain/kv');

var models = require('../models'),
    Price = models.Price,
    CronTab = models.CronTab;

var Ganji = require('../domain/crawlers/ganji'),
    gj = new Ganji(),
    ICBC = require('../domain/crawlers/icbc'),
    icbc = new ICBC();

var _senders = require('./_senders'),
    textSuccess = _senders.textSuccess,
    textWarning = _senders.textWarning,
    textError = _senders.textError;

var JOBS = {
  '142c02ea-6ea2-11e3-b6f8-08002708e90e': require('../domain/crons/job_eastmoney_report_list'),
  'bd1e98c0-6ddc-11e3-88e6-08002708e90e': require('../domain/crons/job_eastmoney_report_content'),

  '26e656b4-7dc1-11e3-b5a1-08002708e90e': require('../domain/crons/job_parttime_ganji_list'),
  '424b83e0-7dc9-11e3-a491-08002708e90e': require('../domain/crons/job_parttime_ganji_content'),

  '8356d634-7453-11e3-9aaf-08002708e90e': require('../domain/crons/job_random_result'),
};

function _execJob(job) {
  var d = q.defer();

  if (job.uuid in JOBS) {
    JOBS[job.uuid]()
      .then(function (result) {
        job.last_result = result;  // FIXME: should this be saved to db?
        job.last_attempt = Date.now();
        d.resolve(job);
      })
      .fail(function (EorW) {
        if (EorW instanceof Error) {
          d.reject(EorW);
        } else {
          // FIXME: Class CrobJob
          if (EorW.substring(0, 3) === 'no ') {
            job.last_result = EorW;  // FIXME: should this be saved to db?
            job.last_attempt = Date.now();
            d.resolve(job);
          } else {
            d.reject(EorW);
          }
        }
      });
  } else {
    d.reject(new Error('invalid job uuid'));
  }

  return d.promise;
}

function price_au(req, res) {
  var key = "b65af840-56e9-11e2-869c-bc5ff444b3d5";
  var interval = 60 * 60; // 1 hour

  KV.isExpired(key, interval)
    .then(function (isExpired) {
      if (isExpired) {
        icbc.fetchPrice()
            .then(function (message) {
              if ('warning' in message) {
                textWarning(res, message.warning);
              } else if ('success' in message) {
                // Price.create(message.success, { })
                var p = Price.build(message.success);

                var ago_7_days = moment().add('days', -7).format();
                var query = {
                  where: {
                    fetched: {
                      gt: ago_7_days
                    }
                  },
                  order: 'medial'
                };

                Price.findAll(query).success(function (prices) {
                  mx = prices[0].medial;
                  mi = prices.slice(-1)[0].medial;

                  p.lower = 0.20 * mx + 0.80 * mi;
                  p.upper = 0.80 * mx + 0.20 * mi;

                  p.save().success(function () {
                    KV.set(key, p.fetched)
                      .then(function () {
                        var _successLog = '/c/p/au: ' + req.get('user-agent');
                        textSuccess(res, 'success', _successLog);
                      })
                      .fail(function (errorText) {
                        textError(res, errorText);
                      })
                      .done();
                  });
                });
              } else {
                textWarning(res, 'NotImplementedException');
              }
            })
            .fail(function (message) {
              textError(res, message.error);
            })
            .done();
      } else {
        textWarning(res, 'not expired');
      }
    })
    .fail()
    .done();
}

function index(req, res, next) {
  CronTab
    .getJob()
    .then(function (job) {
      return _execJob(job);
    })
    .then(function (job) {
      job.save().success(function () {
        res.locals.message = {
          type: 'success',
          text: job.name + ', ' + job.last_result,
        };
        next();
      });
    })
    .fail(function (EorW) {
      if (EorW instanceof Error) {
        res.locals.message = {
          type: 'error',
          text: EorW.toString(),
        };
      } else {
        res.locals.message = {
          type: 'warning',
          text: EorW,
        };
      }

      next();
    })
    .done();
}


module.exports = {
  price_au: price_au,
  index: index,
};
