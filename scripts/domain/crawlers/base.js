var _ = require('lodash'),
    q = require('q'),
    request = require('request');

var workers = require('./workers');

function Crawler(argument) { return this; }
Crawler.prototype.name = "Crawler";

Crawler.prototype.get = function (url, options) {
  var _default_options = {
    timeout: 60000,
    encoding: null
  };
  if (options) {
    _.extend(_default_options, options);
  }

  return workers.get(url, _default_options);
};


module.exports = Crawler;
