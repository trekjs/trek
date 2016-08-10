import test from 'ava'
import Middleware from '../../lib/middleware'

test.beforeEach(t => {
  t.context = new Middleware()
})

test('middleware compose should return result and not throws', async t => {
  const middleware = t.context

  t.notThrows(middleware.compose())
})

test('middleware compose should return result and throws', async t => {
  const middleware = t.context
  t.throws(middleware.compose({}, () => {
    throw new Error('throw an error')
  }), 'throw an error')
})
