var q = require('q');
var $ = require('cheerio');
var _ = require('lodash');

var Crawler = require('../../libs/crawler').Crawler;

var Elance = function () {
  return this;
};

Elance.prototype = new Crawler();

Elance.prototype.parseList = function (last_items) {
  var url = "https://www.elance.com/r/jobs/cat-it-programming";

  return this
    .get(url, { encoding: 'utf-8'})
    .then(function (body) {
      var $html = $(body);
      var $list = $html.find('#jobSearchResults .jobCard');

      // ** they use humanized time that are hard to parse
      var now = new Date();

      var all_items = [];
      var $li;
      var $a;
      var href,
          title,
          content;
      for (var i = 0; i < $list.length; i++) {
        $li = $list.eq(i);
        $a = $li.find('a.title');

        href = $a.attr('href');
        title = $a.text().trim();
        // ** no need to parse content
        content = $li.find('.desc').text().trim();

        all_items.push({
          source: 'elance',
          created: now,
          url: href,
          title: title,
          content: content,
        });
      }

      return Crawler.filterNewItems(all_items, last_items, 'url');
    });
};

Elance.prototype.filters = function (all_items) {
  var d = q.defer();

  var keywords = [ '(open|zen)cart',
                   '(os|big)commerce',
                   'symfony', 'joomla', 'magento', 'shopify', 'sharepoint', 'wordpress',
                   '(seo | seo)',
                   '(java | java)',
                   '(php | php)',
                   '(ios | ios)',
                   'android'].join('|');
  var reg = new RegExp('/' + keywords + '/', 'i');
  var filtered = _.filter(all_items, function (item) {
    return !reg.test(item.title);
  });

  d.resolve(filtered);

  return d.promise;
}

module.exports = Elance;
