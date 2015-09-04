import assert from 'power-assert';
import requireTimes from 'require-times';
import co from 'co';
import swig from 'koa-swig';
import '../src/Trek';
import Config from '../src/Config';
import Paths from '../src/Paths';
import Engine from '../src/Engine';

describe('Engine', () => {

  var app;
  const ROOT_PATH = `${__dirname}/fixtures`;

  before(() => {
    app = new Engine(ROOT_PATH);
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

});
