var q = require('q');

var models = require('../../models'),
    Report = models.Report;

var EastMoney = require('../crawlers/eastmoney'),
    em = new EastMoney();

module.exports = function () {
  var d = q.defer();

  var query = {
    where: {
      content: 'EMPTY',
    }
  };

  Report
    .find(query)
    .success(function (report) {
      if (report) {
        em.parseReportContent(report.url)
          .then(function (data) {
            report.created = data.created;
            report.content = data.content;
            report.save().success(function () {
              d.resolve('report ' + report.id + ' updated');
            });
          })
          .fail(function (EorW) {
            d.reject(EorW);
          })
          .done();
      } else {
        d.reject('no empty report');
      }
    });

  return d.promise;
};
