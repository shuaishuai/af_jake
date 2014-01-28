var q = require('q');

var KV = require('../kv');

var models = require('../../models');
var Parttime = models.Parttime;

var Wuba = require('../crawlers/wuba');
var wb = new Wuba();

var CrawlerFactory = require('../crawlers/factory');
var cf = new CrawlerFactory();

var Task = require('./task');
var task = new Task();

task.do = function () {
  var key = "de032d98-7f3f-11e3-b0be-08002708e90e-lastwuba";
  cf.parseList(key, wb, Parttime, this);
};


module.exports = task;
