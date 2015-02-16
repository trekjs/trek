"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _hasOwn = Object.prototype.hasOwnProperty;
var isObject = _interopRequire(require("lodash-node/modern/lang/isObject"));

var compact = _interopRequire(require("lodash-node/modern/array/compact"));

var uniq = _interopRequire(require("lodash-node/modern/array/uniq"));

var path = _interopRequire(require("path"));

var Application = require("./application").Application;
var Trek = (function () {
  function Trek() {
    _classCallCheck(this, Trek);
  }

  _prototypeProperties(Trek, {
    application: {
      get: function () {
        return this._application || (this._application = new Application());
      },
      set: function (application) {
        this._application = application;
      },
      configurable: true
    },
    configuration: {
      get: function () {
        return this.application.config;
      },
      configurable: true
    },
    root: {
      get: function () {
        return this.application && this.application.config.root;
      },
      configurable: true
    },
    env: {
      get: function () {
        var _ref;
        return (_ref = this, !_hasOwn.call(_ref, "_env") && (_ref._env = process.env.TREK_ENV || process.env.IOJS_ENV || process.env.NODE_ENV || "development"), _ref._env);
      },
      set: function (environment) {
        return this._env = environment;
      },
      configurable: true
    },
    groups: {
      value: function groups() {
        for (var _len = arguments.length, groups = Array(_len), _key = 0; _key < _len; _key++) {
          groups[_key] = arguments[_key];
        }

        var hash = isObject(groups[groups.length - 1]) ? groups.pop() : {};
        var env = Trek.env;
        groups.unshift("default", env);
        return uniq(compact(groups.concat((process.env.TREK_GROUPS || "").split(",")).concat(Object.keys(hash).filter(function (k) {
          return hash[k].includes(env);
        }))));
      },
      writable: true,
      configurable: true
    },
    publicPath: {
      get: function () {
        return this.application && path.resolve(this.application.paths.get("public").first);
      },
      configurable: true
    }
  });

  return Trek;
})();

// export Trek to Global
module.exports = global.Trek = Trek;