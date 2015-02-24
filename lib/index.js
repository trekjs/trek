"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _hasOwn = Object.prototype.hasOwnProperty;

var path = _interopRequire(require("path"));

var isObject = _interopRequire(require("lodash-node/modern/lang/isObject"));

var compact = _interopRequire(require("lodash-node/modern/array/compact"));

var uniq = _interopRequire(require("lodash-node/modern/array/uniq"));

var Application = require("./application").Application;

var Trek = Object.defineProperties({

  groups: (function (_groups) {
    var _groupsWrapper = function groups() {
      return _groups.apply(this, arguments);
    };

    _groupsWrapper.toString = function () {
      return _groups.toString();
    };

    return _groupsWrapper;
  })(function () {
    for (var _len = arguments.length, groups = Array(_len), _key = 0; _key < _len; _key++) {
      groups[_key] = arguments[_key];
    }

    var hash = isObject(groups[groups.length - 1]) ? groups.pop() : {};
    var env = Trek.env;
    groups.unshift("default", env);
    return uniq(compact(groups.concat((process.env.TREK_GROUPS || "").split(",")).concat(Object.keys(hash).filter(function (k) {
      return hash[k].includes(env);
    }))));
  }) }, {
  application: {
    get: function () {
      return this._application || (this._application = new Application());
    },
    set: function (application) {
      this._application = application;
    },
    enumerable: true,
    configurable: true
  },
  configuration: {
    get: function () {
      return this.application.config;
    },
    enumerable: true,
    configurable: true
  },
  root: {
    get: function () {
      return this.application && this.application.config.root;
    },
    enumerable: true,
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
    enumerable: true,
    configurable: true
  },
  publicPath: {
    get: function () {
      return this.application && path.resolve(this.application.paths.get("public").first);
    },
    enumerable: true,
    configurable: true
  }
});

// export Trek to Global
module.exports = global.Trek = Trek;