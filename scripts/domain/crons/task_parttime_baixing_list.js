var q = require('q');

var KV = require('../kv');

var models = require('../../models');
var Parttime = models.Parttime;

var Baixing = require('../crawlers/baixing');
var bx = new Baixing();

var CrawlerFactory = require('../crawlers/factory');
var cf = new CrawlerFactory();

var Task = require('./task');
var task = new Task();

task.do = function () {
  var key = "c88e92cf-87c9-11e3-b866-bc5ff444b3d5-lastbaixing";
  cf.parseList(key, bx, Parttime, this);
};


module.exports = task;
