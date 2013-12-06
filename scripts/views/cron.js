var _ = require('lodash');

var KV = require('../domain/kv');

var models = require('../models'),
    Report = models.Report;

var EastMoney = require('../domain/crawlers/eastmoney'),
    em = new EastMoney(),
    Ganji = require('../domain/crawlers/ganji'),
    gj = new Ganji();

var _senders = require('./_senders'),
    textSuccess = _senders.textSuccess,
    textWarning = _senders.textWarning,
    textError = _senders.textError;


function eastmoney_report_list (req, res) {
  var key = "cee3418f-594d-11e2-a7c3-bc5ff444b3d5-lastreport";
  KV.get(key, function (value) {
    em.parseReportList(value)
      .then(function (message) {
        if ('warning' in message) {
          textWarning(res, message.warning);
        } else if ('success' in message) {
          var reportList = message.success;
          var last_report = reportList[0].url;

          Report.bulkCreate(reportList)
                .success(function () {
                  KV.set(key, last_report, function () {
                    textSuccess(res, 'success');
                  });
                })
                .error(function () {
                  textError(res, 'Report.bulkCreate');
                });
        } else {
          textWarning(res, 'NotImplementedException');
        }
      })
      .fail(function (message) {
        textError(res, message.error);
      })
      .done();
  });
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
      textSuccess(res, 'no job ' + Date.now());
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
        var _successLog = '/c/p/g: ' + Date.now() + ' ' + req.get('user-agent');
        textSuccess(res, Date.now(), _successLog);
      } else {
        textWarning(res, 'NotImplementedException');
      }
    })
    .fail(function (message) {
      textError(res, message.error);
    })
    .done();
}

module.exports = {
  eastmoney_report_list: eastmoney_report_list,
  eastmoney_report_content: eastmoney_report_content,
  parttime_ganji: parttime_ganji,
};
