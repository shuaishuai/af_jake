var q = require('q'),
    _ = require('lodash'),
    $ = require('cheerio'),
    moment = require('moment');

var Crawler = require('../../libs/crawler').Crawler;

var ICBC = function () {
  return this;
};

ICBC.prototype = new Crawler();

ICBC.prototype.fetchPrice = function () {
  var d = q.defer();

  var url = "http://www.icbc.com.cn/ICBCDynamicSite/Charts/GoldTendencyPicture.aspx";

  this.get(url)
      .then(function (body) {
        var $html = $(body.toString());

        var $trList = $html.find('#TABLE1 tr');

        var $trAu = $trList.eq(1);
        // var $trAg = $tr.eq(2);

        var $tdList = $trAu.find('td');

        d.resolve({
          success: {
            fetched: moment().format(),
            sell: $tdList.eq(2).text().trim(),
            buy: $tdList.eq(3).text().trim(),
            medial: $tdList.eq(4).text().trim(),
          }
        });
      })
      .fail(function (error) {
        var errorText = error.name + ': ' + error.message;
        d.reject({ error: errorText });
      })
      .done();

  return d.promise;
};

module.exports = ICBC;
