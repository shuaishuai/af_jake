var fs = require('fs');
var sw = require('./npm-shrinkwrap.json');

function replacer(key, val) {
  if (key === 'resolved' || key === 'from') {
    return undefined;
  } else {
    return val;
  }
}

fs.writeFileSync('./npm-shrinkwrap.json', JSON.stringify(sw, replacer, 2));
