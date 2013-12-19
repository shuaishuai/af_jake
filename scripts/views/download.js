var _ = require('lodash'),
    csv = require('csv'),
    moment = require('moment');

var models = require('../models'),
    Price = models.Price;

function price_csv (req, res) {
  var begin = moment(req.params['begin']);
  var end = moment(req.params['end']);

  if (begin.isValid() && end.isValid()) {
    if (begin < end) {
      var query = {
        where: {
          fetched: {
            between: [ begin.format(), end.format() ]
          },
        }
      };

      Price.findAll(query)
           .success(function (price_list) {
              if (price_list) {
                var columns = Price.repr_fields();
                var data = _.map(price_list, function (p) {
                  return _.pick(p.repr(), columns);
                });

                var filename = 'price.csv';
                res.attachment(filename);
                csv().from(data, { columns: columns })
                     .to(res, { header: true });
              } else {
                res.send('error');
              }
           });
    } else {
      res.send(':begin should less than :end');
    }
  } else {
    res.send('invalid datetime');
  }
}

module.exports = {
  price_csv: price_csv,
};