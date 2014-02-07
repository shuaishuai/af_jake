var q = require('q'),
    _ = require('lodash'),
    $ = require('cheerio'),
    moment = require('moment');

var iconv = require('iconv'),
    ic_gb2312_to_utf8 = new iconv.Iconv('gb2312', 'utf-8//IGNORE');

var Crawler = require('../../libs/crawler').Crawler;

var EastMoney = function () {
  return this;
};

EastMoney.prototype = new Crawler();

EastMoney.prototype.parseList = function (last_items) {
  var host = "http://data.eastmoney.com";
  var url = host + "/report/";

  return this
      .get(url)
      .then(function (body) {
        var d = q.defer();

        // FIXME: try/catch
        var buf = ic_gb2312_to_utf8.convert(body);
        var html = buf.toString('utf-8');

        // ** their typo
        html = html.replace(/<\/a><\/td><\/div>/g, "</a></div></td>");

        var $html = $(html);
        var $trList = $html.find('table#dt_1 tbody tr');

        var all_items = [],
            $tdList;
        for (var i = 0; i < $trList.length; i++) {
          $tdList = $trList.eq(i).find('td');
          var href = host + $tdList.eq(5).find('a').attr('href');

          all_items.push({
            "created": $tdList.eq(1).find("span").attr("title"),
            "code": $tdList.eq(2).text(),
            "name": $tdList.eq(3).text(),
            "url": href,
            "title": $tdList.eq(5).find("a").attr("title"),
          });
        }

        return Crawler.filterNewItems(all_items, last_items, 'url');
      });
};

EastMoney.prototype.parseReportContent = function (url) {
  var d = q.defer();

  this.get(url)
      .then(function (body) {
        var html;
        try {
          var buf = ic_gb2312_to_utf8.convert(body);
          html = buf.toString('utf-8');
        } catch (e) {
          d.reject(new Error('error converting'));
        }

        var $html = $(html);
        var errText = $html.find(".errText");

        if (errText.length > 0) {
          d.resolve({ warning: 'page not found' });
        } else {
          var $created = $html.find('.report-infos span').eq(1);
          var created = moment($created.text(), 'YYYY年MM月DD日 HH:mm').format();

          var $paras = $html.find('#ContentBody p').slice(1);
          var content = $paras.map(function () {
            return $(this).text();
          }).join('\n');

          d.resolve({
            created: created,
            content: content
          });
        }
      })
      .fail(function (error) {
        d.reject(error);
      })
      .done();

  return d.promise;
};

module.exports = EastMoney;
