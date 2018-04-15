var nconf = require('nconf');
var request = require('request');

var APPKEY = nconf.get('TEAMBITION_APPKEY');
var SECRET = nconf.get('TEAMBITION_SECRET');

var AUTHORIZE_URI = ﻿'https://account.teambition.com/oauth2/authorize';
var ACCESS_TOKEN_URI = 'https://account.teambition.com/oauth2/access_token';

var REDIRECT_URI = 'http://jake1.aws.af.cm/oauth/teambition';


function index(req, res) {
  res.redirect(AUTHORIZE_URI + '?client_id=' + APPKEY + '&redirect_uri=' + REDIRECT_URI + '&state=Wh0_C@R3S');
}


function login(req, res) {
  var data = {
    client_id: APPKEY,
    client_secret: SECRET,
    code: req.query['code'],
    grant_type: 'code',
  };

  request.post(ACCESS_TOKEN_URI, { form: data, json: true }, function (error, response, body) {
    if (!error) {
      res.json(body);
    } else {
      console.log(error, response, body);
      res.json(error);
    }
  });
}

module.exports = {
  index: index,
  login: login
};
