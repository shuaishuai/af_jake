var basic = require('./views/basic'),
    api = require('./views/api'),
    cron = require('./views/cron'),
    feed = require('./views/feed'),
    download = require('./views/download'),
    judian = require('./views/judian');

var _headers = require('./views/_headers'),
    never_cache = _headers.never_cache;

var _senders = require('./views/_senders'),
    textSender = _senders.textSender;


function init(app) {
  // basic
  app.get("/", basic.index);
  app.get("/hello", basic.hello);

  // api
  app.get("/api/stockcode/info/:code", api.stockcode_info);
  app.get('/api/stockcode/filter', api.stockcode_filter);
  app.get('/api/crons', api.list_cron);

  // cron
  // app.get("/cron/price/au", never_cache, cron.price_au);
  app.get("/cron", never_cache, cron.index, textSender);
  // app.get("/cron/wuba", never_cache, cron.wuba, textSender);

  // atom
  app.get("/feed/reports", feed.reports);
  app.get("/feed/parttimes/zh", feed.parttimes_zh);
  app.get("/feed/parttimes/en", feed.parttimes_en);

  // download
  app.get("/download/price.csv/:begin/:end", download.price_csv);
  app.get("/download/latest_10_updated_doctors.csv", download.doctor_csv);

  // judian
  app.get("/judian", judian.index);
  app.get("/oauth/teambition", judian.login);
}

exports.init = init;
