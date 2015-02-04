"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _hasOwn = Object.prototype.hasOwnProperty;
var path = _interopRequire(require("path"));

var Application = require("./application").Application;
var Trek = (function () {
  function Trek() {
    _classCallCheck(this, Trek);
  }

  _prototypeProperties(Trek, {
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
    application: {
      get: function () {
        return this._application || (this._application = new Application());
      },
      set: function (application) {
        this._application = application;
      },
      configurable: true
    },
    groups: {
      get: function (groups) {},
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