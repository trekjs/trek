
class MiddlewareStackProxy {

  contructor() {
    this.operations = [];
  }

  insertBefore(args, cb) {
    this.operations.push('insertBefore', args, cb);
  }

  insertAfter(args, cb) {
    this.operations.push('insertAfter', args, cb);
  }

  use(args, cb) {
    this.operations.push('use', args, cb);
  }

  delete(args, cb) {
    this.operations.push('delete', args, cb);
  }

  unshift(args, cb) {
    this.operations.push('unshift', args, cb);
  }

  mergeInto(other) {
    this.operations.forEach((operation, args, cb) => {
      other[operation](args, cb);
    });
  }

}

export default MiddlewareStackProxy;
