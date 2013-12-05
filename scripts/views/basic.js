function index(req, res) {
  res.render('index.dust');
}

var EastMoney = require('../domain/crawlers/eastmoney'),
    Ganji = require('../domain/crawlers/ganji');

function hello(req, res) {
  var m = new EastMoney();
  var g = new Ganji();
  console.log(m.name);
  console.log(g.name);

  res.send('hello');
}

module.exports = {
  index: index,
  hello: hello
};
