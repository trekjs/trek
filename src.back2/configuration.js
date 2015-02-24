
class MiddlewareStackProxy {

  constructor() {
    this._operations = [];
  }

  insertBefore(args, cb) {
    this._operations.push('insertBefore', args, cb);
  }

  insertAfter(args, cb) {
    this._operations.push('insertAfter', args, cb);
  }

  swap(args, cb) {
    this._operations.push('swap', args, cb);
  }

  use(args, cb) {
    this._operations.push('use', args, cb);
  }

  delete(args, cb) {
    this._operations.push('delete', args, cb);
  }

  unshift(args, cb) {
    this._operations.push('unshift', args, cb);
  }

  mergeInto(other) {
    this._operations.forEach((operation, args, cb) => {
      other[operation](args, cb);
    });
    return other;
  }

}

class Generators {

  constructor() {
    this.fallbacks = {};
    this.templates = [];
    this.colorizeLogging = true;
  }

}

export {MiddlewareStackProxy, Generators};
