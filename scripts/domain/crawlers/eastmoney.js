var q = require('q'),
    $ = require('cheerio'),
    moment = require('moment');

var iconv = require('iconv'),
    ic_gb2312_to_utf8 = new iconv.Iconv('gb2312', 'utf-8//IGNORE');

var Crawler = require('./base.js');

var EastMoney = function () {
  return this;
};

EastMoney.prototype = new Crawler();

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
          d.reject({ warning: 'page not found' });
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
      .fail(function (errorText) {
        d.reject(errorText);
      })
      .done();

  return d.promise;
};

module.exports = EastMoney;
