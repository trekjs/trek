import '../src/';
import isFunction from 'lodash-node/modern/lang/isFunction';
import {Engine} from '../src/engine';
import {Root, Path} from '../src/paths';

describe('Engine', () => {
  var myEngine, config;
  beforeEach(() => {
    myEngine = new Engine;
    config = myEngine.config;
  });

  describe('', () => {
    it('', () => {
      console.log('calledFrom', myEngine.calledFrom);
    });
  });

  describe('.config', () => {
    it('set root path', () => {
      config.root = '.';
    });

    describe('generators', () => {
      it('generators', () => {
        console.log(config.generators);
        config.generators().colorizeLogging = false;
        config.generators((g) => {
         g.orm             = 'mysql';
         g.templateEngile  = 'jade';
        });
        config.appGenerators.orm = 'datamapper';

        console.log(myEngine.config.generators());
        console.log(myEngine.config.appGenerators);
      });
    });
  });

  describe('.paths', () => {
    var paths;
    beforeEach(() => {
      paths = myEngine.paths;
    });

    it('should equal `config.paths`', () => {
      paths.should.equal(config.paths);
    });

    it('should be a `Root` instance', () => {
      (paths instanceof Root).should.equal(true);
    })

    describe('get a path', () => {
      it('should be a function', () => {
        isFunction(paths.get).should.equal(true);
      })

      it('get controllers path', () => {
        let ctrls = paths.get('app/controllers');
        (ctrls instanceof Path).should.equal(true);
        ctrls.current.should.equal('app/controllers')
        ctrls.root.should.equal(paths);
      });

    });
  });

  describe('.middleware', () => {
    var middleware;
    beforeEach(() => {
      middleware = myEngine.middleware;
    });

    it('should equal `config.middleware`', () => {
      middleware.should.equal(config.middleware);
    });
  });

  describe('.app', () => {
    it('app', () => {
      console.log(myEngine.app);
    });
  });

});
