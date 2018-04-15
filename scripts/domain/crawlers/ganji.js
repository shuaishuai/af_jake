var q = require('q');
var $ = require('cheerio');
var _ = require('lodash');
var moment = require('moment');

var Crawler = require('../../libs/crawler').Crawler;

var Ganji = function () {
  return this;
};

Ganji.prototype = new Crawler();

Ganji.prototype.parseList = function (last_items) {
  var host = "http://sh.ganji.com";
  var url = host + "/jzwangzhanjianshe/";

  return this
    .get(url, { encoding: 'utf-8'} )
    .then(function (body) {
      var $html = $(body);
      var $dlList = $html.find('.job-list');

      var all_items = [];
      var $dl, href;
      for (var i = 0; i < $dlList.length; i++) {
        $dl = $dlList.eq(i);

        href = host + $dl.find('dt a').attr('href');

        all_items.push({
          source: 'ganji',
          url: href,
        });
      }

      return Crawler.filterNewItems(all_items, last_items, 'url');
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
        var created = $html.find('.d-c-left-hear p .txt').text()
                           .trim().substring(5);

        d.resolve({
          created: moment('2014-' + created).format(),
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

Ganji.prototype.filters = function (all_items) {
  var d = q.defer();

  var keywords = [ '日结', '日薪', '日赚', '现结' ].join('|');
  var reg = new RegExp('/' + keywords + '/', 'i');
  var filtered = _.filter(all_items, function (item) {
    return !reg.test(item.title);
  });

  d.resolve(filtered);

  return d.promise;
}


module.exports = Ganji;
