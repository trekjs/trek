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
      let result = yield this.sendMail({
        from: 'test@valid.sender',
        to: 'test@valid.recipient'
      });
      this.body = yield thenify(this.logger.info)('trek.js');
    });

    request(app.listen())
      .get('/')
      .expect(/trek.js/)
      .expect(200, done);
  });

  it('should have mailer property', (done) => {

    app.mailer.should.not.be.null;
    app.mailer.constructor.name.should.be.equal('Nodemailer')

    app.get('/', function*() {
      let result = yield this.sendMail({
        from: 'test@valid.sender',
        to: 'test@valid.recipient'
      });
      this.body = yield thenify(this.logger.info)(result.response.toString());
    });

    request(app.listen())
      .get('/')
      .expect(/test@valid.recipient/)
      .expect(200, done);
  });

});