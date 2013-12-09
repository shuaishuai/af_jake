function index(req, res) {
  res.render('index.dust');
}

var KV = require('../domain/kv');

function hello(req, res) {
  KV.set('not-exist', 'not-a-value')
    .then(function (value) {
      console.log(value);
    })
    .fail(function (errorText) {
      console.log(errorText);
    })
    .done();

  res.send('hello');
}

module.exports = {
  index: index,
  hello: hello
};
