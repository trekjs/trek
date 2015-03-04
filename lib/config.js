"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _hasOwn = Object.prototype.hasOwnProperty;

var fs = _interopRequire(require("fs"));

var path = _interopRequire(require("path"));

var EventEmitter = require("events").EventEmitter;

var valueForKeyPath = require("./utils").valueForKeyPath;

var Root = require("./paths").Root;

let Config = (function () {
  function Config(root) {
    _classCallCheck(this, Config);

    this.root = root;
    this.emitter = new EventEmitter();
    this.defaultSettings = Object.create(null);
    this.settings = Object.create(null);
  }

  _prototypeProperties(Config, null, {
    paths: {
      get: function () {
        return this._paths || (this._paths = (function (root) {
          let paths = new Root(root);

          paths.add("app");
          paths.add("app/controllers");
          paths.add("app/models");
          paths.add("app/views");

          paths.add("lib");
          paths.add("config");
          paths.add("config/envs", { glob: `${ Trek.env }.js` });
          paths.add("config/secrets", { glob: `${ Trek.env }.js` });
          paths.add("config/locales", { glob: "*.{js,json}" });
          paths.add("config/routes.js");

          paths.add("public");
          paths.add("log", { "with": `log/${ Trek.env }.log` });
          paths.add("tmp");

          return paths;
        })(this.root));
      },
      configurable: true
    },
    secrets: {
      get: function () {
        var _this = this;

        return this._secrets || (this._secrets = (function () {
          let secrets = {};
          let filepath = _this.paths.get("config/secrets").first;
          if (!filepath) return filepath;
          let file = path.resolve(filepath);
          if (fs.existsSync(file)) {
            secrets = require(file);
          }
          var _secrets = secrets;
          if (!_hasOwn.call(_secrets, "secretKeyBase")) _secrets.secretKeyBase = _this.secretKeyBase;

          return secrets;
        })());
      },
      configurable: true
    },
    publicPath: {
      get: function () {
        return this.paths.get("public").first;
      },
      configurable: true
    },
    get: {
      value: function get() {},
      writable: true,
      configurable: true
    },
    set: {
      value: function set() {},
      writable: true,
      configurable: true
    }
  });

  return Config;
})();

module.exports = Config;