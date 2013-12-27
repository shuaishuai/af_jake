var basic = require('./views/basic'),
    api = require('./views/api'),
    cron = require('./views/cron'),
    feed = require('./views/feed'),
    download = require('./views/download');

var _headers = require('./views/_headers'),
    never_cache = _headers.never_cache;


function init(app) {
  // basic
  app.get("/", basic.index);
  app.get("/hello", basic.hello);

  // api
  app.get("/api/stockcode/info/:code", api.stockcode_info);
  app.get('/api/stockcode/filter', api.stockcode_filter);

  // cron
  // app.get("/cron/eastmoney/report/list", never_cache, cron.eastmoney_report_list);
  // app.get("/cron/eastmoney/report/content", never_cache, cron.eastmoney_report_content);
  app.get("/cron/parttime/ganji", never_cache, cron.parttime_ganji);
  app.get("/cron/price/au", never_cache, cron.price_au);
  app.get("/cron", never_cache, cron.main);

  // atom
  app.get("/feed/reports", feed.reports);

  // download
  app.get("/download/price.csv/:begin/:end", download.price_csv);
}

exports.init = init;
