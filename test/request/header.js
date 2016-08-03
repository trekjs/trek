import test from 'ava'
import context from '../helpers/context'

test.beforeEach(t => {
  t.context = context().req
})

test('should return the request header object', t => {
  const req = t.context
  t.is(req.header, req.headers)
})
