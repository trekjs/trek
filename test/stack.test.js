import '../src/';
import {Middleware, MiddlewareStack} from '../src/stack';

describe('MiddlewareStack', () => {
  var stack, foo, bar, fooMiddleware, barMiddleware;
  beforeEach(() => {
    foo = function *() {};
    bar = function *() {};
    fooMiddleware = new Middleware(foo);
    barMiddleware = new Middleware(bar);
    stack = new MiddlewareStack;
    stack.use(fooMiddleware)
    stack.use(barMiddleware)
  });

  it('stack should be an Array instance', () => {
    (stack instanceof Array).should.equal(true);
  });

  it('use should push middleware as a GeneratorFunction onto the stack', () => {
    stack.use(bar);
    bar.should.equal(stack.last.callback);
  });

  it('use should push middleware as a Middleware onto the stack', () => {
    stack.use(barMiddleware);
    barMiddleware.should.equal(stack.last);
    barMiddleware.callback.should.equal(bar);
  });

  it('use should push middleware class with arguments onto the stack', () => {
    stack.use(barMiddleware, true, { foor: 'bar' });
    [true, { foor: 'bar' }].should.eql(stack.last.args);
  });

  it('insert inserts middleware at the integer index', () => {
    stack.insert(1, barMiddleware);
    barMiddleware.should.equal(stack[1]);
  });

  it('insertAfter inserts middleware after the integer index', () => {
    stack.insertAfter(1, barMiddleware);
    barMiddleware.should.equal(stack[2]);
  });

  it('insertBefore inserts middleware before anthor middleware class', () => {
    stack.insertBefore(barMiddleware, barMiddleware);
    barMiddleware.should.equal(stack[1]);
  });

  it('insertAfter inserts middleware after another middleware class', () => {
    stack.insertAfter(barMiddleware, barMiddleware);
    barMiddleware.should.equal(stack[2]);
  });

  it('swaps one middleware out for another', () => {
    fooMiddleware.should.equal(stack[0]);
    stack.swap(fooMiddleware, barMiddleware);
    barMiddleware.should.equal(stack[0]);
  });

  describe('build for app', () => {
  });
});

describe('Middleware', () => {
  var foo, fooMiddleware;
  foo = function *() {};
  fooMiddleware = new Middleware(foo);

  it('callback should be a GeneratorFunction', () => {
    fooMiddleware.callback.should.equal(foo);
    fooMiddleware.callback.constructor.name.should.equal('GeneratorFunction');
  });

});
