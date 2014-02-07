var q = require('q');

var models = require('../../models');
var Parttime = models.Parttime;

var Wuba2 = require('../crawlers/wuba2');
var wb = new Wuba2();

var CrawlerFactory = require('../../libs/crawler').CrawlerFactory;
var cf = new CrawlerFactory();

var Task = require('./task');
var task = new Task();

task.do = function () {
  var key = "450cb9d4-8fa6-11e3-a1d0-08002708e90e-lastwuba2";
  cf.parseList(key, wb, Parttime, this);
};


module.exports = task;
