import co from 'co';
import Trek from '../src/Trek';
import request from 'supertest';

describe('Trek', () => {
  var app;

  before(() => {
    return co(function* () {
      app = new Trek(__dirname + '/fixtures');
      app.logger.level = 'debug';
      yield app.bootstrap();
    });
  });

  it('hello world', (done) => {
    app.get('/', function*(next) {
      return 'Hello World';
    });

    app.post('/', function*(next) {
      return 'Post';
    });

    request(app.listen())
      .get('/')
      .expect(200, 'Hello World', () => {
        request(app.listen())
          .post('/')
          .expect(200, 'Post', done);
      })
  });

  describe('comments resources', () => {

    let server;

    before(() => {
      server = app.listen();
    });

    it('GET /comments', (done) => {
      request(server)
        .get('/comments')
        .expect(200, 'comments#index', done);
    });

    it('POST /comments', (done) => {
      request(server)
        .post('/comments')
        .expect(200, '{"name":"trek","age":233}', done);
    });

    it('DELETE /comments', (done) => {
      request(server)
        .delete('/comments/233')
        .expect(200, 'comments#destroy', done);
    });

    it('GET /comments/new', (done) => {
      request(server)
        .get('/comments/new')
        .expect(200, 'comments#new', done);
    });

  });

});
