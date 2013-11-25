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

var _sendType = {
  ERROR: 'error',
  WARNING: 'warning',
  SUCCESS: 'success',
};

function _send(res, type, message, logentries) {
  if (!message) { message = ""; }

  if (logentries) {
    if (type === _sendType.ERROR) {
      winston.error(logentries);
    } else if (type === _sendType.WARNING) {
      winston.warning(logentries);
    } else {
      winston.info(logentries);
    }
  }

  res.send(type + ": " + message);
}

function eastmoney_report_content (req, res) {
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
              _send(res, _sendType.WARNING, 'page not found');
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
              _send(res, _sendType.SUCCESS, '', _successLog);
            });
          }
        } else {
          var _errorLog = e + ', ' + report.id + ', ' + body;
          _send(res, _sendType.ERROR, html, _errorLog);
        }
      });
    } else {
      _send(res, _sendType.SUCCESS, 'no job');
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
