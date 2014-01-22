var util = require("util");

var q = require('q');
var _ = require('lodash');

var models = require('../../models');
var CronTab = models.CronTab;


function _getJob() {
  var d = q.defer();

  var query = {
    where: {
      active: 1,
    },
    order: 'last_attempt',
  };

  CronTab
    .findAll(query)
    .success(function (ct) {
      var now = Date.now();

      var cronjob = _.find(ct, function (c) {
        var expired = c.last_attempt + c.interval + c.delay;
        return expired <= now;
      });

      if (cronjob) {
        d.resolve(cronjob);
      } else {
        d.reject('no expired cronjob');
      }
    });

  return d.promise;
}

var REGISTERED = {
  '26e656b4-7dc1-11e3-b5a1-08002708e90e': './task_parttime_ganji_list',
  'de032d98-7f3f-11e3-b0be-08002708e90e': './task_parttime_wuba_list',
  'd3cad59c-81a6-11e3-968b-08002708e90e': './task_parttime_content',

  '142c02ea-6ea2-11e3-b6f8-08002708e90e': './task_report_eastmoney_list',
  'bd1e98c0-6ddc-11e3-88e6-08002708e90e': './task_report_eastmoney_content',

  '8bb56b1a-833f-11e3-9b8a-08002708e90e': './task_remove_duplicate',

  '8356d634-7453-11e3-9aaf-08002708e90e': './job_random_result',
};

function _getTask(uuid) {
  var d = q.defer();

  if (uuid in REGISTERED) {
    var task = require(REGISTERED[uuid]);
    d.resolve(task);
  } else {
    d.reject(new Error('invalid cronjob uuid'));
  }

  return d.promise;
}

function _delayMore(interval, last_delay) {
  var y0 = 0.8; // magic
  var a = -2 / interval * Math.log( 2 / (y0 + 1) - 1);

  var y = 2 / (1 + Math.pow(Math.E, -a * last_delay)) - 1;

  var delay = y * interval;

  if (delay < 1000) { // use 1 s as the least interval
    return 1000;
  } else {
    return delay;
  }
}

function _delayLess(last_delay) {
  return last_delay * 0.618;
}

function CronJob() {
  var d = q.defer();

  var job = null;
  _getJob()
    .then(function (cronjob) {
      job = cronjob;
      return _getTask(cronjob.uuid);
    })
    .then(function (task) {
      task.on('success', function (result) {
        job.last_attempt = Date.now();
        job.delay = _delayLess(job.delay);

        job.save().success(function () {
          d.resolve(util.format('%s %s', job.name, result));
        });
      });

      task.on('delay', function (result) {
        job.last_attempt = Date.now();
        job.delay = _delayMore(job.interval, job.delay);

        job.save().success(function () {
          d.resolve(util.format('%s delayed: %s', job.name, result));
        });
      });

      task.on('timeout', function () {
        d.reject(util.format('%s timeout', job.name));
      });

      task.on('error', function (error) {
        d.reject(error);
      });

      task.do();
    })
    .fail(function (error) {
      d.reject(error);
    })
    .done();

  return d.promise;
}


module.exports = CronJob;
