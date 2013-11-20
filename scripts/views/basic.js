var KV = require('../domain/kv');

function index(req, res) {
  res.render('index.dust');
}

function hello(req, res) {
  // console.log(process.env['VCAP_SERVICES']);
  // console.log(process.env['VCAP_SERVICES']['mysql-5.1']);
  // console.log(process.env['VCAP_SERVICES']['mysql-5.1'][0]);

  // KV.get('b65af840-56e9-11e2-869c-bc5ff444b3d5', function (value) {
  //   res.send(value);
  // });

  KV.set('b65af840-56e9-11e2-869c-bc5ff444b3d5', '2013-11-20', function () {
    res.send('kv set success');
  });
}

module.exports = {
  index: index,
  hello: hello
};
