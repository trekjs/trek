"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var fs = _interopRequire(require("fs"));

var path = _interopRequire(require("path"));

var EventEmitter = require("events").EventEmitter;

var _lodashNodeModernLang = require("lodash-node/modern/lang");

var cloneDeep = _lodashNodeModernLang.cloneDeep;
var isPlainObject = _lodashNodeModernLang.isPlainObject;

var _lodashNodeModernObject = require("lodash-node/modern/object");

var defaults = _lodashNodeModernObject.defaults;
var has = _lodashNodeModernObject.has;

var _debug = _interopRequire(require("debug"));

var chalk = _interopRequire(require("chalk"));

var _utils = require("./utils");

var valueForKeyPath = _utils.valueForKeyPath;
var setValueForKeyPath = _utils.setValueForKeyPath;
var hasKeyPath = _utils.hasKeyPath;

var Root = require("./paths").Root;

const debug = _debug("trek:config");

let Config = (function () {
  function Config(root) {
    _classCallCheck(this, Config);

    this.root = root;
    this.emitter = new EventEmitter();
    this.defaultSettings = Object.create(null);
    this.settings = Object.create(null);
  }

  Config.prototype.initialize = function initialize() {
    this.load(this.paths.get("config/application").first);
    this.load(this.paths.get("config/environments").first);
  };

  Config.prototype.load = function load(path) {
    debug("load %s", path);
    try {
      require(path)(this);
    } catch (e) {
      console.log(chalk.bold.red(`${ e }`));
    }
  };

  Config.prototype.get = function get(keyPath, isDefault) {
    let value, defaultValue;
    defaultValue = valueForKeyPath(this.defaultSettings, keyPath);
    if (!isDefault) value = valueForKeyPath(this.settings, keyPath);

    if (value) {
      value = cloneDeep(value);
      if (isPlainObject(value) && isPlainObject(defaultValue)) {
        defaults(value, defaultValue);
      }
    } else {
      value = cloneDeep(defaultValue);
    }

    return value;
  };

  Config.prototype.set = function set(keyPath, value, isDefault) {
    setValueForKeyPath(isDefault ? this.defaultSettings : this.settings, keyPath, value);
  };

  _createClass(Config, {
    paths: {
      get: function () {
        return this._paths || (this._paths = (function (root) {
          let paths = new Root(root);

          paths.add("app");
          paths.add("app/controllers");
          paths.add("app/models");
          paths.add("app/services", {
            glob: "*.js"
          });
          paths.add("app/views");

          paths.add("lib");
          paths.add("config");
          paths.add("config/database", {
            "with": "config/database.js"
          });
          paths.add("config/application", {
            "with": "config/application.js"
          });
          paths.add("config/environments", {
            glob: `${ Trek.env }.js`
          });
          paths.add("config/secrets", {
            glob: `${ Trek.env }.js`
          });
          paths.add("config/locales", {
            glob: "*.{js,json}"
          });
          paths.add("config/routes", {
            "with": "config/routes.js"
          });

          paths.add("public");
          paths.add("log", {
            "with": `log/${ Trek.env }.log`
          });
          paths.add("tmp");

          return paths;
        })(this.root));
      }
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
          if (!has(secrets, "secretKeyBase")) {
            secrets.secretKeyBase = _this.secretKeyBase;
          }
          return secrets;
        })());
      }
    },
    publicPath: {
      get: function () {
        return this.paths.get("public").first;
      }
    },
    viewsPath: {
      get: function () {
        return this.paths.get("app/views").first;
      }
    }
  });

  return Config;
})();

module.exports = Config;