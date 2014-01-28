var q = require('q');
var $ = require('cheerio');
var moment = require('moment');

var Crawler = require('./base.js');

var Ganji = function () {
  return this;
};

Ganji.prototype = new Crawler();

Ganji.prototype.parseList = function (last_job) {
  var host = "http://sh.ganji.com";
  var url = host + "/jzwangzhanjianshe/";

  return this
    .get(url, { encoding: 'utf-8'} )
    .then(function (body) {
      var d = q.defer();

      var $html = $(body);
      var $dlList = $html.find('.job-list');

      var jobList = [];
      var $dl, $a, href, created;
      for (var i = 0; i < $dlList.length; i++) {
        $dl = $dlList.eq(i);
        $a = $dl.find('dt a');

        href = host + $a.attr('href');

        if (href === last_job) {
          break;
        }

        jobList.push({
          source: 'ganji',
          created: moment.unix($dl.attr('pt')).format(),
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

Ganji.prototype.parseJobContent = function (url) {
  var d = q.defer();

  this.get(url)
      .then(function (body) {
        var html = body.toString();

        var $html = $(html);
        // var errText = $html.find(".errText");
        var $title = $html.find('h1');
        var $content = $html.find('.deta-Corp');

        d.resolve({
          title: $title.text().trim(),
          content: $content.text().trim(),
        });
      })
      .fail(function (error) {
        d.reject(error);
      })
      .done();

  return d.promise;
};


module.exports = Ganji;
