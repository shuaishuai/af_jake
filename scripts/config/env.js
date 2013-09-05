var os = require('os');

var IS_LOCAL = ['VirtualU'].indexOf(os.hostname()) > -1;

var _app_port = IS_LOCAL ? 1337 : process.env.VCAP_APP_PORT;

var _mysql_config = 'mysql://root:654321@localhost/af_asimov';
if (!IS_LOCAL) {
  var services = JSON.parse(process.env.VCAP_SERVICES);

  var m = services['mysql-5.1'][0]['credentials'];
  _mysql_config = [
    'mysql://', m.username, ':', m.password, '@', m.hostname, '/', m.name
  ].join('');
}

module.exports = {
  app_port: _app_port,
  mysql_config: _mysql_config,
};
