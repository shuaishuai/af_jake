var q = require('q');
var $ = require('cheerio');
var moment = require('moment');

var Crawler = require('./base.js');

var Wuba = function () {
  return this;
};

Wuba.prototype = new Crawler();

Wuba.prototype.parseList = function (last_job) {
  var url = "http://sh.58.com/jisuanjiwl/";

  return this
    .get(url, { encoding: 'utf-8'})
    .then(function (body) {
      var d = q.defer();

      var $html = $(body);
      var $dlList = $html.find('.infolist dl');

      var jobList = [];
      var $dl, href;
      for (var i = 0; i < $dlList.length; i++) {
        $dl = $dlList.eq(i);

        href = $dl.find('dt a').attr('href');

        if (href === last_job) {
          break;
        }

        jobList.push({
          source: 'wuba',
          url: href,
        });
      }

      if (jobList.length === 0) {
        d.reject('nothing');
      } else {
        d.resolve(jobList);
      }

      return d.promise;
    });
};

Wuba.prototype.parseJobContent = function (url) {
  var d = q.defer();

  this.get(url)
      .then(function (body) {
        var html = body.toString();

        var $html = $(html);
        // var errText = $html.find(".errText");
        var $header = $html.find('.leftbar');
        var $content = $html.find('#zhiwei');

        d.resolve({
          source: 'wuba',
          created: $header.find('.timeD').text().trim(),
          title: $header.find('h1').text().trim(),
          content: $content.text().trim(),
        });
      })
      .fail(function (error) {
        d.reject(error);
      })
      .done();

  return d.promise;
};

module.exports = Wuba;
