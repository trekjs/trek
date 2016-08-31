import test from 'ava'
import Middleware from 'trek-middleware'

test.beforeEach(t => {
  t.context = new Middleware()
})

test('middleware compose should return result and not throws', async t => {
  const middleware = t.context

  t.notThrows(middleware.compose())
})

test('middleware compose should return result and throws', async t => {
  const middleware = t.context
  middleware.push((ctx, next) => {
    ctx.a = 1
    next()
    next()
  })
  t.throws(middleware.compose({}), 'next() called multiple times')
})
