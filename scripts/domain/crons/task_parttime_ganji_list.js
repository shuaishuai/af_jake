var q = require('q');

var models = require('../../models');
var Parttime = models.Parttime;

var Ganji = require('../crawlers/ganji');
var gj = new Ganji();

var CrawlerFactory = require('../crawlers/factory');
var cf = new CrawlerFactory();

var Task = require('./task');
var task = new Task();

task.do = function () {
  var key = "26e656b4-7dc1-11e3-b5a1-08002708e90e-lastganji";
  cf.parseList(key, gj, Parttime, this);
};


module.exports = task;
