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
      return em.parseReportList(value);
    })
    .then(function (reportList) {
      if (reportList.length > 0) {
        return Report.bulkCreate(reportList);
      } else {
        d.reject('no new reports');
      }
    })
    .then(function (reportList) {
      var last_report = reportList[0].url;
      return KV.set(key, last_report, reportList.length);
    })
    .then(function (reportListLen) {
      d.resolve(reportListLen + ' new reports');
    })
    .fail(function (EorW) {
      d.reject(EorW);
    })
    .done();

    return d.promise;
};