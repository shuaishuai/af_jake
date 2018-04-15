var q = require('q');

var KV = require('../kv');

var models = require('../../models');
var Report = models.Report;

var EastMoney = require('../crawlers/eastmoney');
var em = new EastMoney();

var CrawlerFactory = require('../../libs/crawler').CrawlerFactory;
var cf = new CrawlerFactory();

var Task = require('./task');
var task = new Task();


task.do = function () {
  var key = "cee3418f-594d-11e2-a7c3-bc5ff444b3d5-lastreport";
  cf.parseList(key, em, Report, this);
};


module.exports = task;
