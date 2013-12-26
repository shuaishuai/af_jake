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

  Report.find(query).success(function (report) {
    if (report) {
      em.parseReportContent(report.url)
        .then(function (message) {
          if ('warning' in message) {
            report.destroy().success(function () {
              d.resolve(message);
            });
          } else if ( 'success' in message) {
            report.created = message.success.created;
            report.content = message.success.content;
            report.save().success(function () {
              d.resolve({ success: 'report ' + report.id + ' updated' });
            });
          } else {
            d.reject('NotImplementedException');
          }
        })
        .fail(function (message) {
          d.reject(message.error);
        })
        .done();
    } else {
      d.resolve({ warning: 'no empty report' });
    }
  });

  return d.promise;
}