import path from 'path';
import assert from 'assert';
import thenify from 'thenify';
import request from 'supertest';
import Trek from '..';

describe('app', () => {
  let app;
  beforeEach(() => {
    app = new Trek(path.join(__dirname, 'fixtures'));
  });

  it('should 404 without routes', (done) => {

    request(app.listen())
      .get('/')
      .expect(404, done);

  });

  it('should have logger property', (done) => {

    app.logger.should.not.be.null;
    app.logger.should.not.equal(Trek.logger);

    app.get('/', function*() {
      try {
        let result = yield this.sendMail({
          from: 'test@valid.sender',
          to: 'test@valid.recipient'
        });
      } catch(e) {
        console.log(e);
      }
      this.body = yield thenify(this.logger.info)('trek.js');
    });

    request(app.listen())
      .get('/')
      .expect(/trek.js/)
      .expect(200, done);
  });

  it('should be a Promise, sendMail', (done) => {
    app.sendMail({
      from: 'test@valid.sender',
      to: 'test@valid.recipient',
      subject: 'Hello Trek.js',
      html: '<body>TREK.JS</body>'
    }).finally(done);
  });

  it('should have mailer property', (done) => {

    app.mailer.should.not.be.null;
    app.mailer.constructor.name.should.be.equal('Mailer')

    app.get('/', function*() {
      let result = yield this.sendMail({
        from: 'test@valid.sender',
        to: 'test@valid.recipient',
        subject: 'Hello Trek.js',
        html: '<body>TREK.JS</body>'
      });
      this.body = yield thenify(this.logger.info)(result.response.toString());
    });

    request(app.listen())
      .get('/')
      .expect(/test@valid.recipient/)
      .expect(200, done);
  });

  it('should have secrets', () => {
    console.log(app.config.secrets);
  });

  it('should mount other trek app', (done) => {
    var a = new Trek(path.resolve(__dirname, './fixtures'));
    var b = new Trek(path.resolve(__dirname, './fixtures'));

    a.get('/hello', function* () {
      this.logger.info(`AAA's x-request-id: ${this.id}.`);
      this.body = 'Hello';
    });

    b.get('/world', function* () {
      this.logger.info(`BBB's x-request-id: ${this.id}.`);
      this.body = 'World';
    });

    var app = new Trek(path.resolve(__dirname, './fixtures'));
    app.use(function* (next) {
      this.logger.info(`App's x-request-id: ${this.id}.`);
      yield next;
    });
    app.mount(a);
    app.mount(b);

    request(app.listen())
      .get('/')
      .expect(404)
      .end((err) => {
        if (err) done(err);

        request(app.listen())
          .get('/hello')
          .expect('Hello')
          .end((err) => {
            if (err) done(err);

            request(app.listen())
              .get('/world')
              .expect('World', done);
          });
      });
  });

});