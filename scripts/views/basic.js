function index(req, res) {
  res.render('index.dust');
}

var KV = require('../domain/kv');

function hello(req, res) {
  res.json({ hello: 'world' });
}

module.exports = {
  index: index,
  hello: hello
};
