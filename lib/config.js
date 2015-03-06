"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _hasOwn = Object.prototype.hasOwnProperty;

var fs = _interopRequire(require("fs"));

var path = _interopRequire(require("path"));

var EventEmitter = require("events").EventEmitter;

var _utils = require("./utils");

var valueForKeyPath = _utils.valueForKeyPath;
var setValueForKeyPath = _utils.setValueForKeyPath;

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
          paths.add("config/application", { "with": "config/application.js" });
          paths.add("config/environments", { glob: `${ Trek.env }.js` });
          paths.add("config/secrets", { glob: `${ Trek.env }.js` });
          paths.add("config/locales", { glob: "*.{js,json}" });
          paths.add("config/routes", { "with": "config/routes.js" });

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
    viewsPath: {
      get: function () {
        return this.paths.get("app/views").first;
      },
      configurable: true
    },
    load: {
      value: function load(path) {
        console.log(path);
        try {
          require(path)(this);
        } catch (e) {
          console.log(`Missing ${ path } file.`);
        }
      },
      writable: true,
      configurable: true
    },
    get: {
      value: function get(keyPath, isDefault) {
        let value, defaultValue;
        defaultValue = valueForKeyPath(this.defaultSettings, keyPath);
        if (!isDefault) value = valueForKeyPath(this.settings, keyPath);
        if (!value) value = defaultValue;
        return value;
      },
      writable: true,
      configurable: true
    },
    set: {
      value: function set(keyPath, value, isDefault) {
        setValueForKeyPath(isDefault ? this.defaultSettings : this.settings, keyPath, value);
      },
      writable: true,
      configurable: true
    }
  });

  return Config;
})();

module.exports = Config;