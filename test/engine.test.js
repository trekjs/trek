import '../src/';
import isFunction from 'lodash-node/modern/lang/isFunction';
import {Engine} from '../src/engine';
import {Root, Path} from '../src/paths';
import {MiddlewareStackProxy, Generators} from '../src/configuration';

describe('Engine', () => {
  var myEngine, config;
  beforeEach(() => {
    myEngine = new Engine;
    config = myEngine.config;
  });

  describe('app path', () => {
    it('get path', () => {
      myEngine.calledFrom.should.equal(process.cwd());
    });

    it('find root path', () => {
      myEngine.findRoot(__dirname).should.equal(process.cwd());
    });
  });

  describe('.config', () => {
    it('set root path', () => {
      config.root = '.';
    });

    describe('generators', () => {
      it('should be a function', () => {
        isFunction(config.generators).should.equal(true);
      });

      it('should be a Generators instance', () => {
        (config.generators() instanceof Generators).should.equal(true);
      });

      it('set generator', () => {
        config.appGenerators.orm = 'datamapper';

        config.appGenerators.orm.should.equal('datamapper');
        config.generators().orm.should.equal('datamapper');

        config.generators().colorizeLogging = false;
        config.generators((g) => {
          g.orm             = 'mysql';
          g.templateEngine  = 'jade';
        });

        config.generators().colorizeLogging.should.equal(false);
        config.generators().orm.should.equal('mysql');
        config.generators().templateEngine.should.equal('jade');
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

  describe('.run()', () => {
    beforeEach(() => {
      myEngine.app;
    });
    it('runs the app', () => {
      //myEngine.run();
    });
  });

});