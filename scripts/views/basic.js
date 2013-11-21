var KV = require('../domain/kv');

var winston = require('../logger');

function index(req, res) {
  res.render('index.dust');
}

function hello(req, res) {
  winston.log('winston.log');
  winston.info('winston.info');
  winston.warn('winston.warn');
  winston.error('winston.error');

  // KV.get('b65af840-56e9-11e2-869c-bc5ff444b3d5', function (value) {
  //   res.send(value);
  // });

  // KV.set('b65af840-56e9-11e2-869c-bc5ff444b3d5', '2013-11-20', function () {
  //   res.send('kv set success');
  // });

  var created = null;
  created.text();
}

module.exports = {
  index: index,
  hello: hello
};
