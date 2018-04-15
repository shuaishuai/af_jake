var q = require('q');
var $ = require('cheerio');
var moment = require('moment');

var Crawler = require('../../libs/crawler').Crawler;

var JQKA = function () {
  return this;
};

JQKA.prototype = new Crawler();

JQKA.prototype.doctor = function (code) {
  var url = "http://doctor.10jqka.com.cn/" + code

  return this
    .get(url, { encoding: 'utf-8'})
    .then(function (body) {
      var d = q.defer();

      var $html = $(body);
      var $score = $html.find('.stockvalue');

      var score = $score.text().trim();

      d.resolve({
        score: score
      });

      return d.promise;
    });
};


module.exports = JQKA;
