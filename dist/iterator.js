'use strict';

// Shorthand for Symbol.iterator

const SYMBOL_ITERATOR = Symbol.iterator;

/**
 * Make an iterator for middleware.
 *
 * @return {Object}
 * @api public
 */

const iterator = {
  [SYMBOL_ITERATOR](middleware, length, context, nextFunc) {
    return {
      next(i) {
        i = i >>> 0;
        const fn = middleware[i] || nextFunc;
        let nextCalled = false;

        return {
          value: fn && fn(context, () => {
            if (nextCalled) {
              throw new Error('next() called multiple times');
            }
            nextCalled = true;
            return Promise.resolve(this.next(++i).value);
          }),
          done: i === length
        };
      }
    };
  }
};

/**
 * Expose iterator.
 */

module.exports = iterator;