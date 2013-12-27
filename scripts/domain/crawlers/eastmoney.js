var q = require('q'),
    _ = require('lodash'),
    $ = require('cheerio'),
    moment = require('moment');

var iconv = require('iconv'),
    ic_gb2312_to_utf8 = new iconv.Iconv('gb2312', 'utf-8//IGNORE');

var Crawler = require('./base.js');

var EastMoney = function () {
  return this;
};

EastMoney.prototype = new Crawler();

EastMoney.prototype.parseReportList = function (lastreport) {
  var d = q.defer();

  var host = "http://data.eastmoney.com";
  var url = host + "/report/";

  this.get(url)
      .then(function (body) {
        var html;
        try {
          var buf = ic_gb2312_to_utf8.convert(body);
          html = buf.toString('utf-8');
        } catch (e) {
          d.reject({ error: 'error converting' });
        }

        // ** their typo
        html = html.replace(/<\/a><\/td><\/div>/g, "</a></div></td>");

        var $html = $(html);
        var $trList = $html.find('table#dt_1 tbody tr');

        var reportList = [],
            $tdList;
        for (var i = 0; i < $trList.length; i++) {
          $tdList = $trList.eq(i).find('td');
          var href = host + $tdList.eq(5).find('a').attr('href');

          if (href === lastreport) {
            break;
          }

          reportList.push({
            "created": $tdList.eq(1).find("span").attr("title"),
            "code": $tdList.eq(2).text(),
            "name": $tdList.eq(3).text(),
            "url": href,
            "title": $tdList.eq(5).find("a").attr("title"),
          });
        }

        d.resolve({ success: reportList });
      })
      .fail(function (error) {
        d.reject({ error: error.toString() });
      })
      .done();

  return d.promise;
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
          d.reject({ error: 'error converting' });
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
            success: {
              created: created,
              content: content
            }
          });
        }
      })
      .fail(function (error) {
        d.reject({ error: error.toString() });
      })
      .done();

  return d.promise;
};

module.exports = EastMoney;
