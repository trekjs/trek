'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _trekMiddleware = require('trek-middleware');

var _trekMiddleware2 = _interopRequireDefault(_trekMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Middleware extends _trekMiddleware2.default {

  static install(app) {
    const middleware = new Middleware();

    Reflect.defineProperty(app, 'middleware', { value: middleware });

    return middleware;
  }

  // hook: running
  running(app, context, onError) {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield app.callHook('context:created', context);
      yield _this.compose(context).catch(onError);
    })();
  }

  push(fn) {
    if ('function' !== typeof fn) throw new TypeError('middleware must be a function!');
    super.push(fn);
    return this;
  }

}
exports.default = Middleware;