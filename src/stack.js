import compose from 'koa-compose';



class Middleware {

  constructor(/*name, */cb, args) {
    //this._name  = name;
    this._cb    = cb;
    this._args  = args;
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

  unshift(cb, args) {
    let middleware = new Middleware(cb, args);
    this.middleware.unshift(middleware);
  }

  insert(index, cb, args) {
    let index = this.assertIndex(index, 'before');
    let middleware = new Middleware(cb, args);
    this.middlewares.splice(index, 0, middleware);
  }

  insertBefore(index, cb, args) {
    return this.insert(index, cb, args);
  }

  insertAfter(index, cb, args) {
    let index = this.assertIndex(index, 'after');
    this.insert(index + 1, cb, args);
  }

  swap(target, cb, args) {
    let index = this.assertIndex(index, 'before');
    this.insert(index, cb, args);
    this.middlewares.splice(index + 1, 1);
  }

  delete(target) {
    let index = this.middlewares.indexOf(target);
    this.middlewares.splice(index, 1);
  }

  use(cb, args) {
    let middleware = new Middleware(cb, args);
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
