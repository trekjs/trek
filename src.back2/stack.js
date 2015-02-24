import compose from 'koa-compose';

class Middleware {

  constructor(/*name, */args, cb) {
    //this._name  = name;
    this._args  = args;
    this._cb    = cb;
  }

  build(app) {
    // app;
    return this._cb;
  }

}

class MiddlewareStack {

  constructor(cb) {
    this._middlewares = [];
    cb && cb(this);
  }

  get middlewares() {
    return this._middlewares;
  }

  each(cb) {
    this.middleware.forEach(x => cb && cb(x));
  }

  get size() {
    return this.middlewares.length;
  }

  get last() {
    return this.middlewares[this.size - 1];
  }

  get(i) {
    return this.middlewares[i];
  }

  unshift(args, cb) {
    let middleware = new Middleware(args, cb);
    this.middleware.unshift(middleware);
  }

  insert(index, args, cb) {
    let index = this.assertIndex(index, 'before');
    let middleware = new Middleware(args, cb);
    this.middlewares.splice(index, 0, middleware);
  }

  insertBefore(index, args, cb) {
    return this.insert(index, args, cb);
  }

  insertAfter(index, args, cb) {
    let index = this.assertIndex(index, 'after');
    this.insert(index + 1, args, cb);
  }

  swap(target, args, cb) {
    let index = this.assertIndex(index, 'before');
    this.insert(index, args, cb);
    this.middlewares.splice(index + 1, 1);
  }

  delete(target) {
    let index = this.middlewares.indexOf(target);
    this.middlewares.splice(index, 1);
  }

  use(args, cb) {
    let middleware = new Middleware(args, cb);
    this.middlewares.push(middleware);
  }

  build(app, cb) {
    app = app || cb;
    if (!app) {
      throw new Error('MiddlewareStack#build requires an app');
    }
    return compose(this.middlewares.map((m) => m.build(app)));
  }

  assertIndex(index, where) {
    let i = typeof index === 'number' ? index : this.middlewares.indexOf(index);
    if (i < 0 || i >= this.size) {
      throw new Error(`No such middleware to insert ${where}: ${index}`);
    }
    return i;
  }

}


export {Middleware, MiddlewareStack};
