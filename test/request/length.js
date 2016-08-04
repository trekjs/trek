import test from 'ava'
import context from '../helpers/context'

test.beforeEach(t => {
  t.context = context().req
})

test('ctx.length should return length in content-length', t => {
  const req = t.context
  req.header['content-length'] = '10'
  t.is(req.length, 10)
})

test('with no content-length present', t => {
  const req = t.context
  t.true(undefined === req.length)
})
