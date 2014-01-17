var q = require('q');

var KV = require('../kv');

var models = require('../../models');
var Parttime = models.Parttime;

var Ganji = require('../crawlers/ganji');
var gj = new Ganji();


function GanjiJobList() {}
var Task = require('./task');
GanjiJobList.prototype = new Task();


GanjiJobList.prototype.do = function () {
  var that = this;

  var key = "26e656b4-7dc1-11e3-b5a1-08002708e90e-lastganji";
  KV.get(key)
    .then(function (value) {
      // console.log('GanjiJobList:do:A');
      return gj.parseJobList(value);
    })
    .then(function (jobList) {
      // console.log('GanjiJobList:do:B');
      console.log(jobList);
      return Parttime.bulkCreate(jobList);
    })
    .then(function (jobList) {
      // console.log('GanjiJobList:do:C');
      var last_job = jobList[0].url;
      return KV.set(key, last_job, jobList.length);
    })
    .then(function (jobListLen) {
      // console.log('GanjiJobList:do:D');
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


module.exports = new GanjiJobList();
