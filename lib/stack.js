"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var isFunction = _interopRequire(require("lodash-node/modern/lang/isFunction"));

var compose = _interopRequire(require("koa-compose"));

var Middleware = (function () {
  function Middleware(cb, args) {
    _classCallCheck(this, Middleware);

    this.callback = cb;
    this.args = args;
  }

  _prototypeProperties(Middleware, null, {
    build: {

      /*
        function callback(app, args) {
          return function* (next) {
            yield* next;
          }
        }
      */

      value: function build() {
        var app = arguments[0] === undefined ? null : arguments[0];

        return this.callback.apply(app, this.args);
      },
      writable: true,
      configurable: true
    }
  });

  return Middleware;
})();

var MiddlewareStack = (function (Array) {
  function MiddlewareStack(cb) {
    _classCallCheck(this, MiddlewareStack);

    if (isFunction(cb)) cb(this);
  }

  _inherits(MiddlewareStack, Array);

  _prototypeProperties(MiddlewareStack, null, {
    each: {
      value: function each(cb) {
        if (isFunction(cb)) this.forEach(function (x) {
          return cb(x);
        });
      },
      writable: true,
      configurable: true
    },
    size: {
      get: function () {
        return this.length;
      },
      configurable: true
    },
    last: {
      get: function () {
        return this[this.length - 1];
      },
      configurable: true
    },
    unshift: {
      value: function unshift(cb) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var middleware = this._createMiddleware(cb, args);
        _get(Object.getPrototypeOf(MiddlewareStack.prototype), "unshift", this).call(this, middleware);
      },
      writable: true,
      configurable: true
    },
    insert: {
      value: function insert(index, cb) {
        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        var index = this.assertIndex(index, "before");
        var middleware = this._createMiddleware(cb, args);
        this.splice(index, 0, middleware);
      },
      writable: true,
      configurable: true
    },
    insertBefore: {
      value: function insertBefore(index, cb) {
        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        return this.insert(index, cb, args);
      },
      writable: true,
      configurable: true
    },
    insertAfter: {
      value: function insertAfter(index, cb) {
        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        var index = this.assertIndex(index, "after");
        this.insert(index + 1, cb, args);
      },
      writable: true,
      configurable: true
    },
    swap: {
      value: function swap(target, cb) {
        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        var index = this.assertIndex(target, "before");
        this.insert(index, cb, args);
        this.splice(index + 1, 1);
      },
      writable: true,
      configurable: true
    },
    "delete": {
      value: function _delete(target) {
        var index = this.indexOf(target);
        this.splice(index, 1);
      },
      writable: true,
      configurable: true
    },
    use: {
      value: function use(cb) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var middleware = this._createMiddleware(cb, args);
        this.push(middleware);
      },
      writable: true,
      configurable: true
    },
    build: {
      value: function build(app) {
        if (!app) throw new Error("MiddlewareStack#build requires an app");
        return compose(this.map(function (m) {
          return m.build(app);
        }));
      },
      writable: true,
      configurable: true
    },
    assertIndex: {
      value: function assertIndex(index, where) {
        var i = typeof index === "number" ? index : this.indexOf(index);
        if (i < 0 || i > this.length) {
          throw new Error(`No such middleware to insert ${ where }: ${ index }`);
        }
        return i;
      },
      writable: true,
      configurable: true
    },
    _createMiddleware: {
      value: function _createMiddleware(cb, args) {
        var middleware = undefined;
        if (cb instanceof Middleware) {
          middleware = cb;
          middleware.args = args;
        } else middleware = new Middleware(cb, args);
        return middleware;
      },
      writable: true,
      configurable: true
    }
  });

  return MiddlewareStack;
})(Array);

exports.Middleware = Middleware;
exports.MiddlewareStack = MiddlewareStack;
Object.defineProperty(exports, "__esModule", {
  value: true
});