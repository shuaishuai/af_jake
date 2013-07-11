function index(req, res) {
  res.render('index.ejs');
}

var cheerio = require('cheerio');

function hello(req, res) {
  var $ = cheerio.load('<h2 id="title">Hello world</h2>');

  var $h = $('h2');

  var text = [
    "id: ", $h.attr('id'), "<br/>",
    "text: ", $h.text()
  ].join("");

  res.send(text);
}

module.exports = {
  index: index,
  hello: hello
};
