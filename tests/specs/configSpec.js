var expect = require('chai').expect;

describe('config', function () {
  it('env', function(){
    var env = require('../../scripts/config/env');

    expect(env.logentries_token).to.be.a('string');
    expect(env.app_port).to.be.a('number');
    expect(env.mysql_config).to.be.a('string');
  });

  it('salt', function () {
    var salt = require('../../scripts/config/salt');

    expect(salt.cookie_salt).to.be.a('string');
    expect(salt.session_key).to.be.a('string');
  });

  it('server', function () {
    var server = require('../../scripts/config/server');

    expect(server.createServer).to.be.a('function');
  });

  it('session', function () {
    var session = require('../../scripts/config/session');

    expect(session.getSessionStore).to.be.a('function');
  });
});