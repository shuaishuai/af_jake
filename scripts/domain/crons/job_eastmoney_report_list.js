var q = require('q');

var KV = require('../kv');

var models = require('../../models'),
    Report = models.Report;

var EastMoney = require('../crawlers/eastmoney'),
    em = new EastMoney();

module.exports = function () {
  var d = q.defer();

  var key = "cee3418f-594d-11e2-a7c3-bc5ff444b3d5-lastreport";
  KV.get(key)
    .then(function (value) {
      em.parseReportList(value)
        .then(function (message) {
          if ('warning' in message) {
            d.resolve(message);
          } else if ('success' in message) {
            var reportList = message.success;

            if (reportList.length > 0) {
              var last_report = reportList[0].url;
              Report.bulkCreate(reportList)
                    .success(function () {
                      KV.set(key, last_report)
                        .then(function () {
                          d.resolve({ success: reportList.length + ' new reports' });
                        }).
                        fail(function (errorText) {
                          d.reject(errorText);
                        });
                    })
                    .error(function (errors) {
                      console.log(errors);
                      d.reject(res, 'Report.bulkCreate');
                    });
            } else {
              d.resolve({ warning: 'no new reports' });
            }
          } else {
            d.reject('NotImplementedException');
          }
        })
        .fail(function (message) {
          d.reject(message.error);
        })
        .done();
    })
    .fail(function (errorText) {
      d.reject(errorText);
    })
    .done();

    return d.promise;
};