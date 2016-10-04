'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Env {

  static install(app) {
    app.paths.set('config/.env', { single: true });

    const env = new Env();

    Reflect.defineProperty(app, 'env', { value: env });
    Reflect.defineProperty(app, 'dev', { value: env.dev });

    return env;
  }

  // hook: created
  created(app) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let env = yield app.paths.get('config/.env', true);
      if (env) {
        _dotenv2.default.config({ path: env, silent: true });
      }

      app.paths.set('config/envs', { single: true, glob: `config/envs/${ _this.current }` });
      env = yield app.paths.get('config/envs', true);
      if (env) {
        _dotenv2.default.config({ path: env, silent: true });
      }
    })();
  }

  get current() {
    return process.env.TREK_ENV || process.env.NODE_ENV || 'dev';
  }

  get dev() {
    return this.current.startsWith('dev');
  }

  get prod() {
    return this.current.startsWith('prod');
  }

  get test() {
    return this.current === 'test';
  }

}
exports.default = Env;