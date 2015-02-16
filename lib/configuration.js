"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var MiddlewareStackProxy = (function () {
  function MiddlewareStackProxy() {
    _classCallCheck(this, MiddlewareStackProxy);

    this._operations = [];
  }

  _prototypeProperties(MiddlewareStackProxy, null, {
    insertBefore: {
      value: function insertBefore(args, cb) {
        this._operations.push("insertBefore", args, cb);
      },
      writable: true,
      configurable: true
    },
    insertAfter: {
      value: function insertAfter(args, cb) {
        this._operations.push("insertAfter", args, cb);
      },
      writable: true,
      configurable: true
    },
    swap: {
      value: function swap(args, cb) {
        this._operations.push("swap", args, cb);
      },
      writable: true,
      configurable: true
    },
    use: {
      value: function use(args, cb) {
        this._operations.push("use", args, cb);
      },
      writable: true,
      configurable: true
    },
    "delete": {
      value: function _delete(args, cb) {
        this._operations.push("delete", args, cb);
      },
      writable: true,
      configurable: true
    },
    unshift: {
      value: function unshift(args, cb) {
        this._operations.push("unshift", args, cb);
      },
      writable: true,
      configurable: true
    },
    mergeInto: {
      value: function mergeInto(other) {
        this._operations.forEach(function (operation, args, cb) {
          other[operation](args, cb);
        });
        return other;
      },
      writable: true,
      configurable: true
    }
  });

  return MiddlewareStackProxy;
})();

var Generators = function Generators() {
  _classCallCheck(this, Generators);

  this.fallbacks = {};
  this.templates = [];
  this.colorizeLogging = true;
};

exports.MiddlewareStackProxy = MiddlewareStackProxy;
exports.Generators = Generators;
Object.defineProperty(exports, "__esModule", {
  value: true
});