var expect = require('chai').expect;

describe('domain.crawlers', function () {
  describe('Crawler', function () {
    var Crawler = require('../../scripts/domain/crawlers/base'),
        c = new Crawler();

    it('if not respond after {timeout} in ms, fail it', function (done) {
      c
        .get('http://www.facebook.com', { timeout: 500 })
        .fail(function (EorW) {
          expect(EorW).to.be.a('string');
          done();
        })
        .done();
    });
  });
});