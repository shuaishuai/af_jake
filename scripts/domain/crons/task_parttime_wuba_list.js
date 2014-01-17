var q = require('q');

var KV = require('../kv');

var models = require('../../models');
var Parttime = models.Parttime;

var Wuba = require('../crawlers/wuba');
var wb = new Wuba();


function WubaJobList() { }
var Task = require('./task');
WubaJobList.prototype = new Task();


WubaJobList.prototype.do = function () {
  var that = this;

  var key = "de032d98-7f3f-11e3-b0be-08002708e90e-lastwuba";
  KV.get(key)
    .then(function (value) {
      return wb.parseJobList(value);
    })
    .then(function (jobList) {
      return Parttime.bulkCreate(jobList);
    })
    .then(function (jobList) {
      var last_job = jobList[0].url;
      return KV.set(key, last_job, jobList.length);
    })
    .then(function (jobListLen) {
      that.emit('success', jobListLen + ' new jobs');
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
};


module.exports = new WubaJobList();
