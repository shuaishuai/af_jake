var _ = require('lodash'),
    csv = require('csv'),
    moment = require('moment');

var models = require('../models'),
    Doctor = models.Doctor;

function price_csv (req, res) {
  var begin = moment(req.param('begin'));
  var end = moment(req.param('end'));

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

function doctor_csv (req, res) {
  var query = {
    where: {
      is_parsed: 1,
    },
    order: 'updated DESC',
    limit: 10,
  };

  Doctor
    .findAll(query)
    .success(function (doctor_list) {
      if (doctor_list) {
        var columns = [ 'hospitals', 'firstname', 'lastname', 'credentials',
                        'address', 'city', 'state', 'zip', 'phone', 'fax' ];
        var data = _.map(doctor_list, function (d) {
          return _.pick(d, columns);
        });

        var filename = 'latest_10_updated_doctors.csv';
        res.attachment(filename);
        csv().from(data, { columns: columns })
             .to(res, { header: true, delimiter: "|" });
      } else {
        res.send('error');
      }
    });
}

module.exports = {
  price_csv: price_csv,
  doctor_csv: doctor_csv,
};