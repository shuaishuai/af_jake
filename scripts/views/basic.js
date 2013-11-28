// var KV = require('../domain/kv');
// var winston = require('../logger');

function index(req, res) {
  res.render('index.dust');
}

var _senders = require('./_senders'),
    textSuccess = _senders.textSuccess,
    textWarning = _senders.textWarning,
    textError = _senders.textError;

function hello(req, res) {
  textError(res, 'hello', 'error');
  // winston.log('winston.log');
  // winston.info('winston.info');
  // winston.warn('winston.warn');
  // winston.error('winston.error');

  // KV.get('b65af840-56e9-11e2-869c-bc5ff444b3d5', function (value) {
  //   res.send(value);
  // });

  // KV.set('b65af840-56e9-11e2-869c-bc5ff444b3d5', '2013-11-20', function () {
  //   res.send('kv set success');
  // });
}

module.exports = {
  index: index,
  hello: hello
};
