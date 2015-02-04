"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var compose = _interopRequire(require("koa-compose"));

var Middleware = (function () {
  function Middleware( /*name, */cb, args) {
    _classCallCheck(this, Middleware);

    //this._name  = name;
    this._cb = cb;
    this._args = args;
  }

  _prototypeProperties(Middleware, null, {
    build: {
      value: function build(app) {
        // app;
        return this._cb;
      },
      writable: true,
      configurable: true
    }
  });

  return Middleware;
})();

var MiddlewareStack = (function () {
  function MiddlewareStack(cb) {
    _classCallCheck(this, MiddlewareStack);

    this._middlewares = [];
    cb && cb(this);
  }

  _prototypeProperties(MiddlewareStack, null, {
    middlewares: {
      get: function () {
        return this._middlewares;
      },
      configurable: true
    },
    each: {
      value: function each(cb) {
        this.middleware.forEach(function (x) {
          return cb && cb(x);
        });
      },
      writable: true,
      configurable: true
    },
    size: {
      get: function () {
        return this.middlewares.length;
      },
      configurable: true
    },
    last: {
      get: function () {
        return this.middlewares[this.size - 1];
      },
      configurable: true
    },
    get: {
      value: function get(i) {
        return this.middlewares[i];
      },
      writable: true,
      configurable: true
    },
    unshift: {
      value: function unshift(cb, args) {
        var middleware = new Middleware(cb, args);
        this.middleware.unshift(middleware);
      },
      writable: true,
      configurable: true
    },
    insert: {
      value: function insert(index, cb, args) {
        var index = this.assertIndex(index, "before");
        var middleware = new Middleware(cb, args);
        this.middlewares.splice(index, 0, middleware);
      },
      writable: true,
      configurable: true
    },
    insertBefore: {
      value: function insertBefore(index, cb, args) {
        return this.insert(index, cb, args);
      },
      writable: true,
      configurable: true
    },
    insertAfter: {
      value: function insertAfter(index, cb, args) {
        var index = this.assertIndex(index, "after");
        this.insert(index + 1, cb, args);
      },
      writable: true,
      configurable: true
    },
    swap: {
      value: function swap(target, cb, args) {
        var index = this.assertIndex(index, "before");
        this.insert(index, cb, args);
        this.middlewares.splice(index + 1, 1);
      },
      writable: true,
      configurable: true
    },
    "delete": {
      value: function _delete(target) {
        var index = this.middlewares.indexOf(target);
        this.middlewares.splice(index, 1);
      },
      writable: true,
      configurable: true
    },
    use: {
      value: function use(cb, args) {
        var middleware = new Middleware(cb, args);
        this.middlewares.push(middleware);
      },
      writable: true,
      configurable: true
    },
    build: {
      value: function build(app, cb) {
        app = app || cb;
        if (!app) {
          throw new Error("MiddlewareStack#build requires an app");
        }
        return compose(this.middlewares.map(function (m) {
          return m.build(app);
        }));
      },
      writable: true,
      configurable: true
    },
    assertIndex: {
      value: function assertIndex(index, where) {
        var i = typeof index === "number" ? index : this.middlewares.indexOf(index);
        if (i < 0 || i >= this.size) {
          throw new Error(`No such middleware to insert ${ where }: ${ index }`);
        }
        return i;
      },
      writable: true,
      configurable: true
    }
  });

  return MiddlewareStack;
})();

exports.Middleware = Middleware;
exports.MiddlewareStack = MiddlewareStack;
exports.__esModule = true;