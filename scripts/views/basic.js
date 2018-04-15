var request = require('request');

function index(req, res) {
  res.json({
    name: "Jake on AppFog",
    desc: "Hello, I'm Jake the Spider!",
    author: "https://shuaishuai.github.io"
  });
}

function hello(req, res) {
  // request.get("http://www.google.com", {}, function (error, response, body) {
  //   if (!error) {
  //     res.send("Google is available");
  //   } else {
  //     console.log(error, response, body);
  //     res.send(error.toString());
  //   }
  // });
  var Crawler = require('../libs/crawler').Crawler;
  Crawler.get();
  res.send('hello');
}

module.exports = {
  index: index,
  hello: hello
};
