var _ = require('lodash'),
    q = require('q'),
    moment = require('moment');

var KV = require('../domain/kv');

var models = require('../models'),
    Price = models.Price,
    CronTab = models.CronTab;

var ICBC = require('../domain/crawlers/icbc'),
    icbc = new ICBC();

var _senders = require('./_senders'),
    textSuccess = _senders.textSuccess,
    textWarning = _senders.textWarning,
    textError = _senders.textError;

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

var CronJob = require('../domain/crons/cronjob');

function index (req, res, next) {
  var cj = new CronJob();

  cj
    .then(function (result) {
      res.locals.message = {
        type: 'success',
        text: result,
      };
      next();
    })
    .fail(function (error) {
      if (typeof error === 'string') {
        res.locals.message = {
          type: 'warning',
          text: error,
        };
        next();
      } else {
        res.locals.message = {
          type: 'error',
          text: error.toString(),
        };
        next();
      }
    });
}


module.exports = {
  price_au: price_au,
  index: index,
};
