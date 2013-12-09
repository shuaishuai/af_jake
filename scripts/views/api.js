var _ = require('lodash');

var models = require('../models.js');
    StockCode = models.StockCode;

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

  market = req.query['market'];
  if (market) {
    query.where['market'] = market;
  }

  is_active = req.query['is_active'];
  if (is_active) {
    query.where['is_active'] = parseInt(is_active, 10);
  }

  is_hs300 = req.query['is_hs300'];
  if (is_hs300) {
    query.where['is_hs300'] = parseInt(is_hs300, 10);
  }

  is_jqka = req.query['is_jqka'];
  if (is_jqka) {
    query.where['is_jqka'] = parseInt(is_jqka, 10);
  }

  StockCode.findAll(query).success(function (stockcodes) {
    var codes = _.pluck(stockcodes, 'code');
    res.json(codes);
  });
  // FIXME: not found
}


module.exports = {
  stockcode_info: stockcode_info,
  stockcode_filter: stockcode_filter
};
