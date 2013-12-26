var _ = require('lodash'),
    moment = require('moment');

var KV = require('../domain/kv');

var models = require('../models'),
    Report = models.Report,
    Price = models.Price;

var EastMoney = require('../domain/crawlers/eastmoney'),
    em = new EastMoney(),
    Ganji = require('../domain/crawlers/ganji'),
    gj = new Ganji(),
    ICBC = require('../domain/crawlers/icbc'),
    icbc = new ICBC();

var _senders = require('./_senders'),
    textSuccess = _senders.textSuccess,
    textWarning = _senders.textWarning,
    textError = _senders.textError;


function eastmoney_report_list (req, res) {
  var key = "cee3418f-594d-11e2-a7c3-bc5ff444b3d5-lastreport";
  KV.get(key)
    .then(function (value) {
      em.parseReportList(value)
      .then(function (message) {
        if ('warning' in message) {
          textWarning(res, message.warning);
        } else if ('success' in message) {
          var reportList = message.success;

          if (reportList.length > 0) {
            var last_report = reportList[0].url;
            Report.bulkCreate(reportList)
                  .success(function () {
                    KV.set(key, last_report)
                      .then(function () {
                        var _successLog = '/c/e/r/l: ' + reportList.length + ' ' + req.get('user-agent');
                        textSuccess(res, 'success', _successLog);
                      }).
                      fail(function (errorText) {
                        textError(res, errorText);
                      });
                  })
                  .error(function (errors) {
                    console.log('F');
                    textError(res, 'Report.bulkCreate', errors);
                  });
          } else {
            textSuccess(res, 'no new reports');
          }
        } else {
          textWarning(res, 'NotImplementedException');
        }
      })
      .fail(function (message) {
        textError(res, message.error);
      })
      .done();
    })
    .fail(function (errorText) {
      textError(res, errorText);
    })
    .done();
}

function eastmoney_report_content (req, res) {
  var query = {
    where: {
      content: 'EMPTY',
    }
  };

  Report.find(query).success(function (report) {
    if (report) {
      em.parseReportContent(report.url)
        .then(function (message) {
          if ('warning' in message) {
            report.destroy().success(function () {
              textWarning(res, message.warning);
            });
          } else if ( 'success' in message) {
            report.created = message.success.created;
            report.content = message.success.content;
            var _successLog = '/c/e/r/c: ' + report.id + ' ' + req.get('user-agent');
            report.save().success(function () {
              textSuccess(res, report.id, _successLog);
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
      textSuccess(res, 'no job ');
    }
  });
}

function parttime_ganji(req, res) {
  gj.getJobList()
    .then(function (message) {
      if ('warning' in message) {
        textWarning(res, message.warning);
      } else if ('success' in message) {
        var job_list = message.success;
        var _successLog = '/c/p/g: ' + req.get('user-agent');
        textSuccess(res, 'success', _successLog);
      } else {
        textWarning(res, 'NotImplementedException');
      }
    })
    .fail(function (message) {
      textError(res, message.error);
    })
    .done();
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

var Cron = require('../domain/crons/main');

function main(req, res) {
  Cron.excuteJob()
    .then(function (message) {
      if ('success' in message) {
        var _successLog = message.success + ', ' + req.get('user-agent');
        textSuccess(res, message.success, _successLog);
      } else if ('warning' in message) {
        var _warningLog = message.warning + ', ' + req.get('user-agent');
        textWarning(res, message.warning, _warningLog);
      }
    })
    .fail()
    .done();
}

module.exports = {
  eastmoney_report_list: eastmoney_report_list,
  eastmoney_report_content: eastmoney_report_content,
  parttime_ganji: parttime_ganji,
  price_au: price_au,
  main: main,
};
