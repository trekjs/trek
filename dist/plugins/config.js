'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.has');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.set');

var _lodash6 = _interopRequireDefault(_lodash5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class Config {

  static install(app) {
    app.paths.set('config', { single: true });
    app.paths.set('config/defaults.js', { single: true });
    app.paths.set('config/local.js', { single: true });

    const config = new Config(app);

    Reflect.defineProperty(app, 'config', { value: config });

    return config;
  }

  constructor(app) {
    this.app = app;
    this.store = Object.create(null);
    this.set('subdomain offset', 2);
    this.set('trust proxy', false);
  }

  created(app) {
    var _this = this;

    return _asyncToGenerator(function* () {
      app.paths.set('config/env.js', { single: true, glob: `config/${ app.env.current }.js` });

      const configs = yield Promise.all(['config/defaults.js', 'config/env.js', 'config/local.js'].map(function (path) {
        return app.paths.get(path);
      }));

      configs.filter(function (path) {
        return path !== undefined;
      }).forEach(function (config) {
        return Object.assign(_this.store, app.loader.require(config));
      });
    })();
  }

  get(key, defaultValue) {
    return (0, _lodash2.default)(this.store, key, defaultValue);
  }

  has(key) {
    return (0, _lodash4.default)(this.store, key);
  }

  set(key, value) {
    return (0, _lodash6.default)(this.store, key, value);
  }

}
exports.default = Config;