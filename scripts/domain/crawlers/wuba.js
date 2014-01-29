var q = require('q');
var $ = require('cheerio');
var moment = require('moment');

var Crawler = require('./base.js');

var Wuba = function () {
  return this;
};

Wuba.prototype = new Crawler();

Wuba.prototype.parseList = function (last_items) {
  var url = "http://sh.58.com/jisuanjiwl/";

  return this
    .get(url, { encoding: 'utf-8'})
    .then(function (body) {
      var $html = $(body);
      var $dlList = $html.find('.infolist dl');

      var all_items = [];
      var $dl, href;
      for (var i = 0; i < $dlList.length; i++) {
        $dl = $dlList.eq(i);
        href = $dl.find('dt a').attr('href');
        all_items.push({
          source: 'wuba',
          url: href,
        });
      }

      return Crawler.filterNewItems(all_items, last_items, 'url');
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
