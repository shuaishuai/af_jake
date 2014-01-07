var expect = require('chai').expect;

describe('domain.crawlers', function () {
  describe('Crawler', function () {
    var Crawler = require('../../scripts/domain/crawlers/base'),
        c = new Crawler();

    it('if not respond in 5000ms, timeout/fail it', function (done) {
      this.timeout(7000);
      c
        .get('http://www.facebook.com')
        // .then(function (body) {
        //   console.log(body);
        //   done();
        // })
        .fail(function (EorW) {
          expect(EorW).to.be.a('string');
          done();
        })
        .done();
    });
  });
});