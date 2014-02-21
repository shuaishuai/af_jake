var q = require('q');

var models = require('../../models');
var Doctor = models.Doctor;

var USNews = require('../crawlers/usnews');
var un = new USNews();

var CrawlerFactory = require('../../libs/crawler').CrawlerFactory;
var cf = new CrawlerFactory();

var Task = require('./task');
var task = new Task();

task.do = function () {
  var key = "380c0ea6-a01d-11e3-aec7-bc5ff444b3d5-lastusnews";
  cf.parseList(key, un, Doctor, this);
};


module.exports = task;
