// The Atom Syndication Format
// http://www.ietf.org/rfc/rfc4287.txt
var moment = require('moment');
var _ = require('lodash');

var models = require('../models');
var Report = models.Report;
var Parttime = models.Parttime;


function reports(req, res) {
  var query = {
    where: { content: { ne: 'EMPTY' } },
    order: 'id DESC',
    limit: 50,
  };

  Report.findAll(query).success(function (reports) {
    var context = {
      reports: _.map(reports, function (r) {
        return r.dataValues;
      }),
      updated: moment().format(),
    };

    res.header('Content-Type', 'text/xml');
    res.render('reports.dust', context);
  });
}

function parttimes_zh(req, res) {
  var query = {
    where: { content: { ne: 'EMPTY' }, source: [ 'baixing', 'ganji', 'wuba' ] },
    order: 'id DESC',
    limit: 50,
  };

  Parttime.findAll(query).success(function (parttimes) {
    var context = {
      parttimes: _.map(parttimes, function (r) {
        return r.dataValues;
      }),
      updated: moment().format(),
    };

    res.header('Content-Type', 'text/xml');
    res.render('parttimes.dust', context);
  });
}

function parttimes_en(req, res) {
  var query = {
    where: { content: { ne: 'EMPTY' }, source: [ 'elance' ] },
    order: 'id DESC',
    limit: 50,
  };

  Parttime.findAll(query).success(function (parttimes) {
    var context = {
      parttimes: _.map(parttimes, function (r) {
        return r.dataValues;
      }),
      updated: moment().format(),
    };

    res.header('Content-Type', 'text/xml');
    res.render('parttimes.dust', context);
  });
}

module.exports = {
  reports: reports,
  parttimes_zh: parttimes_zh,
  parttimes_en: parttimes_en,
};
