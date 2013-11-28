var _ = require('lodash'),
    moment = require('moment'),
    $ = require('cheerio'),
    request = require('request');

var winston = require('../logger');

var models = require('../models'),
    Report = models.Report;

var iconv = require('iconv'),
    ic_gb2312_to_utf8 = new iconv.Iconv('gb2312', 'utf-8//IGNORE');

function _converter(body) {
  try {
    var buf = ic_gb2312_to_utf8.convert(body);
    return buf.toString('utf-8');
  } catch (e) {
    winston.error(e);
    return "error converting";
  }
}

var utils = require('./_utils'),
    textSuccess = utils.textSuccess,
    textWarning = utils.textWarning,
    textError = utils.textError;


function eastmoney_report_content (req, res) {
  // winston.info('#########/c/e/r/c');
  // winston.info(req.headers);
  // winston.info(req.get('user-agent'));
  // winston.info(req.get('cache-control'));

  var query = {
    where: {
      content: 'EMPTY',
    }
  };

  Report.find(query).success(function (report) {
    if (report) {
      request.get(report.url, { encoding: null }, function (e, r, body) {
        var html = _converter(body);

        if (!e && r.statusCode === 200 && html != "error converting") {
          var $html = $(html);
          var errText = $html.find(".errText");

          if (errText.length > 0) {
            report.destroy().success(function () {
              textWarning(res, 'page not found');
            });
          } else {
            var $created = $html.find('.report-infos span').eq(1);
            var created = moment($created.text(), 'YYYY年MM月DD日 HH:mm').format();

            var $paras = $html.find('#ContentBody p').slice(1);
            var content = $paras.map(function () {
              return $(this).text();
            }).join('\n');

            report.created = created;
            report.content = content;
            var _successLog = '/cron/eastmoney/report/content: ' + report.id + " " + req.get('user-agent');
            report.save().success(function () {
              textSuccess(res, report.id, _successLog);
            });
          }
        } else {
          var _errorLog = e + ', ' + report.id + ', ' + body;
          textError(res, html, _errorLog);
        }
      });
    } else {
      textSuccess(res, 'no job ' + Date.now());
    }
  });
}

function parttime_ganji(req, res) {
  var host = "http://sh.ganji.com";
  var url = host + "/jzwangzhanjianshe/";
  request.get(url, { encoding: null }, function (e, r, body) {
    var parsedHTML  = $.load(body);
    var job_list = parsedHTML('.job-list').map(function () {
      var $dl = $(this);
      var $a = $dl.find('dt a');

      return { created: $dl.attr('pt'), url: host + $a.attr('href') };
    });
    console.log(job_list);

    // res.send(body);
  });

  res.send('parttime_ganji');
}

module.exports = {
  eastmoney_report_content: eastmoney_report_content,
  parttime_ganji: parttime_ganji,
};
