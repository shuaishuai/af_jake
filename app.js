// ######## CONFIG BEGIN ########
var nconf = require('nconf'),
    os = require('os');

nconf
  .argv()
  .env()
  .file({ file: 'settings.json' });

nconf.set('is_local', [ 'ALBERTATMP', 'vDebian' ].indexOf(os.hostname()) > -1);
// ######## CONFIG END ########

var express = require('express');
var app = express();

// // ** to use dustjs-linkedin
// // https://github.com/chovy/express-template-demo/blob/master/demo/app.js
// var dust = require('dustjs-linkedin'),
//     cons = require('consolidate');

// var dustHelpers = require('./scripts/domain/dust.helpers');
// dustHelpers.init(dust.helpers);

// app.engine('dust', cons.dust);
// app.set('view engine', 'dust');
// app.set('views', __dirname + '/templates');

// static folder
app.use(express.static(__dirname + '/public'));

// use
var cookieParser = express.cookieParser(nconf.get('cookie_salt')); // signedCookieParser
app.use(cookieParser);

app.use(express.session({
  secret: nconf.get('cookie_salt'),
  key: nconf.get('session_key'),
  store: new express.session.MemoryStore(),
}));

// app.use(express.logger());
// app.use(express.bodyParser());

// Server
var server = require('http').createServer(app);

// Socket.IO
// var io = require('./scripts/io').createSocket(server, sessionStore, cookieParser);

// routes
require('./scripts/routes').init(app);

// error handling
app.use(function (req, res, next) {
  res.status(404).send("404 Not Found :(");
});

app.use(function (err, req, res, next) {
  res.status(500).send(err.toString());
});


var port = nconf.get('VCAP_APP_PORT') || 3000;
server.listen(port);
console.log("server starts on port %s", port);
