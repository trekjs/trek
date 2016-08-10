import test from 'ava'
import Middleware from '../../lib/middleware'

test.beforeEach(t => {
  t.context = new Middleware()
})

test('middleware[Symbol.iterator] should a function', t => {
  const middleware = t.context
  t.true('function' === typeof middleware[Symbol.iterator])
})

test('middleware[Symbol.iterator]() should return self', t => {
  const middleware = t.context
  t.is(middleware, middleware[Symbol.iterator]())
})

test('middleware iterator', async t => {
  const middleware = t.context
  middleware.push((ctx, next) => {
    ctx.arr.push(1)
    next()
    ctx.arr.push(6)
  })
  middleware.push((ctx, next) => {
    ctx.arr.push(2)
    next()
    ctx.arr.push(5)
  })
  middleware.push((ctx, next) => {
    ctx.arr.push(3)
    next()
    ctx.arr.push(4)
  })

  const iter = middleware[Symbol.iterator]()

  t.is('function', typeof iter.next)

  const ctx = { arr: [] }

  await iter.next(0, ctx)

  t.deepEqual(ctx.arr, [1, 2, 3, 4, 5, 6])
})
