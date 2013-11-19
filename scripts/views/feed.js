var moment = require('moment');

var models = require('../models'),
    Report = models.Report;

// http://www.ietf.org/rfc/rfc4287.txt
function reports(req, res) {
  var query = {
    where: { content: { ne: 'EMPTY'} },
    order: 'id DESC',
    limit: 50,
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
