var express = require('express');
var app = express();

var salt = require('./scripts/config/salt');
var env = require('./scripts/config/env');

// ** to use dustjs-linkedin
// https://github.com/chovy/express-template-demo/blob/master/demo/app.js
var dust = require('dustjs-linkedin'),
    cons = require('consolidate');

var dustHelpers = require('./scripts/domain/dust.helpers');
dustHelpers.init(dust.helpers);

app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', __dirname + '/templates');

// static folder
app.use(express.static(__dirname + '/public'));

// use
var cookieParser = express.cookieParser(salt.cookie_salt); // signedCookieParser
app.use(cookieParser);

var sessionStore = require('./scripts/config/session').getSessionStore();
app.use(express.session({
  secret: salt.cookie_salt,
  key: salt.session_key,
  store: sessionStore
}));
// app.use(express.logger());
// app.use(express.bodyParser());

// Server
var server = require('./scripts/config/server').createServer(app);

// Socket.IO
// var io = require('./scripts/io').createSocket(server, sessionStore, cookieParser);

// routes
require('./scripts/routes').init(app);

server.listen(1337);
console.log("server starts on port 1337...");