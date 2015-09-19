import assert from 'power-assert';
import requireTimes from 'require-times';
import request from 'supertest';
import co from 'co';
import _ from 'lodash';
import swig from 'koa-swig';
import '../src/Trek';
import Config from '../src/Config';
import Paths from '../src/Paths';
import Engine from '../src/Engine';

describe('Engine', () => {

  var app;
  const ROOT_PATH = `${__dirname}/fixtures`;

  before(() => {
    return co(function* () {
      app = new Engine(ROOT_PATH);
      app.logger.level = 'debug';
      yield app.bootstrap();
    });
  });

  describe('#env', () => {

    it('should return `Trek.env`', () => {
      assert(app.env === Trek.env);
    });

  });

  describe('#rootPath', () => {

    it('should set a path', () => {
      app.rootPath = 'fixtures';
      assert(app.rootPath === 'fixtures');
    });

    it('should get a path', () => {
      app.rootPath = ROOT_PATH;
      assert(app.rootPath === __dirname + '/fixtures');
    });

  });

  describe('#config', () => {

    it('should return a Config instance', () => {
      assert(app.config instanceof Config);
    });

  });

  describe('#paths', () => {

    it('should return a Paths instance', () => {
      assert(app.paths instanceof Paths);
    });

    it('should equal to #config.paths', () => {
      assert(app.paths === app.config.paths);
    });

  });

  describe('#run()', () => {

    it('should be a function', () => {
      assert(_.isFunction(app.run) === true);
    });

    it('should return a promise', () => {
      assert(app.run().constructor.name === 'Promise');
    });

  });

  describe('#*render()', () => {
    var user = {
      name: 'tobi'
    };

    before(() => {
      app.engine('html', swig());
    });

    it('should render the template', () => {

      return co(function *() {
        var str = yield app.render('user', {
          user: user
        });
        assert(str === '<p>tobi</p>\n');

        var str1 = yield app.render('config', {
          user: {
            name: 'robo'
          }
        });
        assert(str1 === 'html\n');
      });
    });

  });

  describe('http verbs, get(), post(), all()', () => {

    it('#all()', (done) => {

      app.all('/tobi', function* (){
        this.body = this.req.method;
      });

      request(app.listen())
        .put('/tobi')
        .expect('PUT', function(){
          request(app.listen())
          .get('/tobi')
          .expect('GET', done);
        });

    });

  });

  describe('#context', () => {

    before(() => {
      app.engine('html', swig());
    });

    describe('#render()', () => {

      it('should render template', () => {

        app.get('/', function* () {
          yield this.render('user', {
            user: {
              name: 'trek'
            }
          });
        });

        return request(app.listen())
          .get('/')
          .expect(200, '<p>trek</p>\n');

      });

    });

    describe('#sendFile()', () => {

      it('should send a file', () => {

        app.get('/robot.txt', function* () {

          yield this.sendFile(`${this.app.rootPath}/public/robot.txt`);

        });

        return request(app.listen())
          .get('/robot.txt')
          .expect(200, '// robots\n');

      });

    });

    describe('#json()', () => {

      it('should response with json', () => {

        app.get('/users', function* () {

          this.json([{
            name: 'trek'
          }]);

        });

        return request(app.listen())
          .get('/users')
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(200, '[{"name":"trek"}]');

      });

    });

    describe('#jsonp()', () => {

      it('should response with jsonp', () => {

        app.get('/jsonp', function* () {

          this.jsonp({
            count: 1
          });

        });

        return request(app.listen())
          .get('/jsonp?callback=something')
          .expect('Content-Type', 'application/javascript; charset=utf-8')
          .expect('X-Content-Type-Options', 'nosniff')
          .expect(200, /something\(\{"count":1\}\);/);

      });

    });

  });

  describe('serve static', () => {

    it('#index()', () => {

      app.index(`${app.rootPath}/public/index.html`);

      return request(app.listen())
        .get('/')
        .expect(200);

    });

    it('#favicon()', () => {

      app.favicon(`${app.rootPath}/public/favicon.ico`);

      return request(app.listen())
        .get('/favicon.ico')
        .expect(200);

    });

    it('#static()', () => {

      app.static('/scripts', `${app.rootPath}/public/scripts`);

      return request(app.listen())
        .get('/scripts/main.js')
        .expect(200);

    });

    it('#serveDir()', () => {

      app.serveDir('/styles', `${app.rootPath}/public/styles`);

      return request(app.listen())
        .get('/styles/main.css')
        .expect(200);

    });

  });

});
