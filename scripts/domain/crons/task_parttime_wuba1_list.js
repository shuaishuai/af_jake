var q = require('q');

var models = require('../../models');
var Parttime = models.Parttime;

var Wuba1 = require('../crawlers/wuba1');
var wb = new Wuba1();

var CrawlerFactory = require('../../libs/crawler').CrawlerFactory;
var cf = new CrawlerFactory();

var Task = require('./task');
var task = new Task();

task.do = function () {
  var key = "de032d98-7f3f-11e3-b0be-08002708e90e-lastwuba1";
  cf.parseList(key, wb, Parttime, this);
};


module.exports = task;
