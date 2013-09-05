var _ = require('lodash'),
    moment = require('moment'),
    cheerio = require('cheerio'),
    request = require('request');

var models = require('../models'),
    Report = models.Report;

var iconv = require('iconv'),
    ic_gb2312_to_utf8 = new iconv.Iconv('gb2312', 'utf-8//IGNORE');

function _converter(body) {
  try {
    var buf = ic_gb2312_to_utf8.convert(body);
    return buf.toString('utf-8');
  } catch (e) {
    console.log(e);
    return "error converting";
  }
}

var _sendType = {
  ERROR: 'error',
  WARNING: 'warning',
  SUCCESS: 'success',
};

function _send(res, type, message) {
  if (!message) { message = ""; }

  res.send(type + ": " + message);
}

function eastmoney_report_content (req, res) {
  var sql = "SELECT `url` FROM `report` WHERE `content` = 'EMPTY' LIMIT 0, 2";

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
          var $ = cheerio.load(html);
          var errText = $(".errText");

          if (errText.length > 0) {
            report.destroy().success(function () {
              _send(res, _sendType.WARNING, 'page not found');
            });
          } else {
            var $created = $('.report-infos span').eq(1);
            var created = moment($created.text(), 'YYYY年MM月DD日 HH:mm').format();

            var $paras = $('#ContentBody p').slice(1);
            var content = $paras.map(function () {
              return $(this).text();
            }).join('\n');

            report.created = created;
            report.content = content;
            report.save().success(function () {
              _send(res, _sendType.SUCCESS);
            });
          }
        } else {
          console.log(e);
          console.log(html);
          _send(res, _sendType.ERROR, html);
        }
      });
    } else {
      _send(res, _sendType.SUCCESS, 'no job');
    }
  });
}

module.exports = {
  eastmoney_report_content: eastmoney_report_content,
};
