var q = require('q');

var models = require('../../models'),
    Report = models.Report;

var EastMoney = require('../crawlers/eastmoney'),
    em = new EastMoney();


function ReportContent() {}
var Task = require('./task');
ReportContent.prototype = new Task();

ReportContent.prototype.do = function () {
  var that = this;

  var query = {
    where: {
      content: 'EMPTY',
    }
  };

  Report
    .find(query)
    .success(function (report) {
      if (report) {
        em
          .parseReportContent(report.url)
          .then(function (data) {
            report.created = data.created;
            report.content = data.content;
            report.save().success(function () {
              that.emit('success', '::' + report.id + ' updated');
            });
          })
          .fail(function (error) {
            if (typeof error === 'string') {
              if (error === '404') {
                pt.destroy().success(function () {
                  that.emit('error', error);
                });
              } else {
                that.emit('error', error);
              }
            } else {
              that.emit('error', error);
            }
          })
          .done();
      } else {
        that.emit('delay', 'no empty report');
      }
    });
};

module.exports = new ReportContent();
