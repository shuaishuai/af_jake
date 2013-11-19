var moment = require('moment');

var models = require('../models'),
    Report = models.Report;

function reports(req, res) {
  var query = {
    limit: 50
  };

  Report.findAll(query).success(function (reports) {
    var updated = moment().format();

    var context = { reports: reports, updated: updated };

    res.header('Content-Type', 'text/xml');
    res.render('reports.dust', context);
  });
}

module.exports = {
  reports: reports,
};
