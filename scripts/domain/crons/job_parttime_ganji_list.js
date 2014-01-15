var q = require('q');

var KV = require('../kv');

var models = require('../../models');
var Parttime = models.Parttime;

var Ganji = require('../crawlers/ganji');
var gj = new Ganji();


module.exports = function () {
  var d = q.defer();

  var key = "26e656b4-7dc1-11e3-b5a1-08002708e90e-lastganji";
  KV.get(key)
    .then(function (value) {
      return gj.parseJobList(value);
    })
    .then(function (jobList) {
      if (jobList.length > 0) {
        return Parttime.bulkCreate(jobList);
      } else {
        d.reject('no new jobs');
      }
    })
    .then(function (jobList) {
      var last_job = jobList[0].url;
      return KV.set(key, last_job, jobList.length);
    })
    .then(function (jobListLen) {
      d.resolve(jobListLen + ' new jobs');
    })
    .fail(function (EorW) {
      d.reject(EorW);
    })
    .done();

    return d.promise;
};