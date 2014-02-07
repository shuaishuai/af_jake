var q = require('q');
var $ = require('cheerio');
var moment = require('moment');

var Crawler = require('../../libs/crawler').Crawler;

var Baixing = function () {
  return this;
};

Baixing.prototype = new Crawler();

Baixing.prototype.parseList = function (last_items) {
  var url = "http://shanghai.baixing.com/shejijianzhi/";

  return this
    .get(url, { encoding: 'utf-8'})
    .then(function (body) {
      var $html = $(body);
      var $list = $html.find('#normal-list ul li');

      var all_items = [];
      var $li;
      var href;
      for (var i = 0; i < $list.length; i++) {
        $li = $list.eq(i);
        href = $li.find('a').attr('href');
        all_items.push({
          source: 'baixing',
          url: href,
        });
      }

      return Crawler.filterNewItems(all_items, last_items, 'url');
    });
};

Baixing.prototype.parseJobContent = function (url) {
  var d = q.defer();

  this.get(url)
      .then(function (body) {
        var html = body.toString();

        var $html = $(html);
        // var errText = $html.find(".errText");
        var $title = $html.find('.viewad-title');
        var $content = $html.find('.viewad-descript').next();
        var $meta = $html.find('.viewad-meta');

        var created = $meta.find('.action').next().text().trim();

        d.resolve({
          source: 'baixing',
          created: moment(created, "MM月DD日 HH:mm").format(),
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

module.exports = Baixing;
