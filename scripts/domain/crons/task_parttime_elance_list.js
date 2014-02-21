var q = require('q');

var models = require('../../models');
var Parttime = models.Parttime;

var Elance = require('../crawlers/elance');
var ec = new Elance();

var CrawlerFactory = require('../../libs/crawler').CrawlerFactory;
var cf = new CrawlerFactory();

var Task = require('./task');
var task = new Task();

task.do = function () {
  var key = "1ed4b4cc-9ab6-11e3-8a39-bc5ff444b3d5-lastelance";
  cf.parseList(key, ec, Parttime, this);
};


module.exports = task;
