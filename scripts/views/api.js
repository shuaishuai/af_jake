var _ = require('lodash');
var moment = require('moment');

var models = require('../models.js');
var StockCode = models.StockCode;
var CronTab = models.CronTab;

function _format_timedelta(ms) {
  var remainder = 0;

  var hours = Math.floor(ms / 3600000);
  remainder = ms % 3600000;

  var minutes = Math.floor(remainder / 60000);
  remainder = remainder % 60000;

  var seconds = Math.floor(remainder / 1000);
  var milliseconds = remainder % 1000;

  if (hours) {
    return hours  + ' hours, ' + minutes + ' miniuts';
  } else if (minutes) {
    return minutes  + ' minutes, ' + seconds + ' seconds';
  } else {
    return seconds  + ' seconds, ' + milliseconds + ' milliseconds';
  }
}


// /api/stockcode/info/600016
function stockcode_info(req, res) {
  var query = {
    where: {
      code: req.params.code,
    }
  };

  StockCode.find(query).success(function (stockcode) {
    res.json(stockcode);
  });
  // FIXME: not found
}

// /api/stockcode/filter?market=sh&is_hs300=1&is_active=1&is_jqka=1
function stockcode_filter(req, res) {
  var query = {
    where: {}
  };

  market = req.query.market;
  if (market) {
    query.where.market = market;
  }

  is_active = req.query.is_active;
  if (is_active) {
    query.where.is_active = parseInt(is_active, 10);
  }

  is_hs300 = req.query.is_hs300;
  if (is_hs300) {
    query.where.is_hs300 = parseInt(is_hs300, 10);
  }

  is_jqka = req.query.is_jqka;
  if (is_jqka) {
    query.where.is_jqka = parseInt(is_jqka, 10);
  }

  StockCode.findAll(query).success(function (stockcodes) {
    var codes = _.pluck(stockcodes, 'code');
    res.json(codes);
  });
  // FIXME: not found
}

// /api/crons
function list_cron (req, res) {
  // var query = {
  //   where: {
  //     code: req.params.code,
  //   }
  // };

  CronTab.findAll().success(function (crons) {
    var results = _.map(crons, function (c) {
      return {
        id: c.id,
        active: c.active === 1,
        name: c.name,
        interval: _format_timedelta(c.interval),
        delay: _format_timedelta(c.delay),
        last_attempt: moment(c.last_attempt).fromNow(),
      }
    });
    res.json(results);
  });
}


module.exports = {
  stockcode_info: stockcode_info,
  stockcode_filter: stockcode_filter,
  list_cron: list_cron,
};
