var q = require('q'),
    _ = require('lodash'),
    $ = require('cheerio'),
    moment = require('moment');

var iconv = require('iconv-lite');

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
        var html = iconv.decode(body, 'gb2312');

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
          html = iconv.decode(body, 'gb2312');
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

// TODO: asimov
// def updateInfo(self, market, code):
//     # code: 600016, market: sh
//     # code: 000002, market: sz
//     urlRoot = 'http://f10.eastmoney.com/f10_v2/'
//     endpoint = '%sFinanceAnalysis.aspx?code=%s%06d' % (urlRoot, market, code)
//     print "processing...", endpoint

//     h = requests.get(endpoint)
//     if h.status_code == 404:
//         return {
//             'code': code,
//             'name': 'DELIST',
//             'is_delist': 1
//         }
//     else:
//         soup = BeautifulSoup(h.text)

//         name = soup.find('p', { 'class' : 'key' }).findAll('a')[0].find(text=True).strip()
//         is_delist = int(not soup.find('ul', { 'id': 'ZYZBTab' }))
//         return {
//             'code': code,
//             'name': name,
//             'is_delist': is_delist
//         }

module.exports = EastMoney;
