"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _hasOwn = Object.prototype.hasOwnProperty;
var _configuration = require("./configuration");

var MiddlewareStackProxy = _configuration.MiddlewareStackProxy;
var Generators = _configuration.Generators;
var Configuration = (function () {
  function Configuration() {
    if (!_hasOwn.call(Configuration, "options")) Configuration.options = [];
  }

  _prototypeProperties(Configuration, null, {
    appMiddleware: {
      get: function () {
        return (!_hasOwn.call(Configuration, "appMiddleware") && (Configuration.appMiddleware = new MiddlewareStackProxy()), Configuration.appMiddleware);
      },
      configurable: true
    },
    appGenerators: {
      get: function () {
        return (!_hasOwn.call(Configuration, "appGenerators") && (Configuration.appGenerators = new Generators()), Configuration.appGenerators);
      },
      configurable: true
    },
    beforeConfiguration: {
      value: function beforeConfiguration(cb) {},
      writable: true,
      configurable: true
    },
    beforeInitialize: {
      value: function beforeInitialize(cb) {},
      writable: true,
      configurable: true
    },
    afterInitialize: {
      value: function afterInitialize(cb) {},
      writable: true,
      configurable: true
    }
  });

  return Configuration;
})();

var Trekking = (function () {
  function Trekking() {}

  _prototypeProperties(Trekking, {
    generators: {
      value: function generators(cb) {
        this._generators || (this._generators = []);
        if (cb) {
          this._generators.push(cb);
        }
        return this._generators;
      },
      writable: true,
      configurable: true
    },
    instance: {
      get: function () {
        return this._instance || (this._instance = new Trekking());
      },
      configurable: true
    },
    configure: {
      value: function configure(cb) {
        this._instance.configure(cb);
      },
      writable: true,
      configurable: true
    }
  }, {
    configure: {
      value: function configure(cb) {
        cb.call(this);
      },
      writable: true,
      configurable: true
    },
    config: {
      get: function () {
        return this._config || (this._config = new Configuration());
      },
      configurable: true
    }
  });

  return Trekking;
})();

exports.Trekking = Trekking;
exports.Configuration = Configuration;
exports.__esModule = true;