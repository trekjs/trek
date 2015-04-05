import Trek from '../src/Trek';
import request from 'supertest';

describe('Trek', () => {
  var app;
  beforeEach(() => {
    app = new Trek();
  });

  it('hello world', (done) => {
    app.get('/', function*(next) {
      this.body = 'Hello World';
    });

    request(app.listen())
      .get('/')
      .expect(200, 'Hello World', done);
  });
});
