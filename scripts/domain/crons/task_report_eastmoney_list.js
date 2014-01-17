var q = require('q');

var KV = require('../kv');

var models = require('../../models');
var Report = models.Report;

var EastMoney = require('../crawlers/eastmoney');
var em = new EastMoney();


function EMReportList() {}
var Task = require('./task');
EMReportList.prototype = new Task();


EMReportList.prototype.do = function () {
  var that = this;

  var key = "cee3418f-594d-11e2-a7c3-bc5ff444b3d5-lastreport";
  KV.get(key)
    .then(function (value) {
      return em.parseReportList(value);
    })
    .then(function (reportList) {
      return Report.bulkCreate(reportList);
    })
    .then(function (reportList) {
      var last_report = reportList[0].url;
      return KV.set(key, last_report, reportList.length);
    })
    .then(function (reportListLen) {
      that.emit('success', reportListLen + ' new reports');
    })
    .fail(function (error) {
      if (typeof error === 'string') {
        if (error === 'timeout') {
          that.emit('timeout');
        } else if (error === 'nothing') {
          that.emit('delay', error);
        } else {
          // 404? wtf? die!
          console.log(error);
          throw('WTF');
        }
      } else {
        that.emit('error', error);
      }
    })
    .done();
}

module.exports = new EMReportList();
