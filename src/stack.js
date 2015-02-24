import isFunction from 'lodash-node/modern/lang/isFunction';
import compose from 'koa-compose';

class Middleware {

  constructor(cb, args) {
    this.callback = cb;
    this.args  = args;
  }

  /*
    function callback(app, args) {
      return function* (next) {
        yield* next;
      }
    }
  */
  build(app = null) {
    return this.callback.apply(app, this.args);
  }

}

class MiddlewareStack extends Array {

  constructor(cb) {
    if (isFunction(cb)) cb(this);
  }

  each(cb) {
    if (isFunction(cb)) this.forEach(x => cb(x));
  }

  get size() {
    return this.length;
  }

  get last() {
    return this[this.length - 1];
  }

  unshift(cb, ...args) {
    let middleware = this._createMiddleware(cb, args)
    super.unshift(middleware);
  }

  insert(index, cb, ...args) {
    let index = this.assertIndex(index, 'before');
    let middleware = this._createMiddleware(cb, args)
    this.splice(index, 0, middleware);
  }

  insertBefore(index, cb, ...args) {
    return this.insert(index, cb, args);
  }

  insertAfter(index, cb, ...args) {
    let index = this.assertIndex(index, 'after');
    this.insert(index + 1, cb, args);
  }

  swap(target, cb, ...args) {
    let index = this.assertIndex(target, 'before');
    this.insert(index, cb, args);
    this.splice(index + 1, 1);
  }

  delete(target) {
    let index = this.indexOf(target);
    this.splice(index, 1);
  }

  use(cb, ...args) {
    let middleware = this._createMiddleware(cb, args)
    this.push(middleware);
  }

  build(app) {
    if (!app) throw new Error('MiddlewareStack#build requires an app');
    return compose(this.map(m => m.build(app)));
  }

  assertIndex(index, where) {
    let i = typeof index === 'number' ? index : this.indexOf(index);
    if (i < 0 || i > this.length) {
      throw new Error(`No such middleware to insert ${where}: ${index}`);
    }
    return i;
  }

  _createMiddleware(cb, args) {
    let middleware;
    if (cb instanceof Middleware) {
      middleware = cb;
      middleware.args = args;
    } else middleware = new Middleware(cb, args);
    return middleware;
  }

}

export { Middleware, MiddlewareStack };