import test from 'ava'
import Middleware from '../../lib/middleware'

test.beforeEach(t => {
  t.context = new Middleware()
})

test('middleware should an array-like object', t => {
  const middleware = t.context
  t.true(middleware instanceof Middleware)
  t.true(middleware instanceof Array)
})
