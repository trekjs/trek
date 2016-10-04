'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _globby = require('globby');

var _globby2 = _interopRequireDefault(_globby);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Paths {

  constructor(root) {
    this.root = root;
    this.blueprint = new Map();
  }

  set(key, value) {
    this.blueprint.set(key, value || key);
    return this;
  }

  get(key, absolute = false) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const value = _this.blueprint.get(key) || key;
      let matched = value.matched;
      if (matched && matched.length) {
        return matched;
      }

      const pattern = value.glob || (value.single ? key : value);
      const result = yield (0, _globby2.default)(pattern, { realpath: absolute, cwd: _this.root });
      matched = value.matched = value.single ? result[0] : result;
      _this.set(key, value);
      return matched;
    })();
  }

  getAll(absolute = false) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const result = Object.create(null);
      for (const key of _this2.blueprint.keys()) {
        result[key] = yield _this2.get(key, absolute); // eslint-disable-line babel/no-await-in-loop
      }
      return result;
    })();
  }

  globby(pattern, options) {
    return _asyncToGenerator(function* () {
      return yield (0, _globby2.default)(pattern, options);
    })();
  }

}
exports.default = Paths;