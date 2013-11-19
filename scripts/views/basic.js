function index(req, res) {
  res.render('index.dust');
}

var cheerio = require('cheerio');

function hello(req, res) {
  console.log(process.env['VCAP_SERVICES']);
  console.log(process.env['VCAP_SERVICES']['mysql-5.1']);
  console.log(process.env['VCAP_SERVICES']['mysql-5.1'][0]);

  res.send('hello');
}

module.exports = {
  index: index,
  hello: hello
};
