import test from 'ava'
import context from '../helpers/context'

test.beforeEach(t => {
  t.context = context().req
})

test('when Accept-Encoding is populated', t => {
  const req = t.context
  req.headers['accept-encoding'] = 'gzip, compress;q=0.2'
  t.deepEqual(req.acceptsEncodings(), ['gzip', 'compress', 'identity'])
  t.is(req.acceptsEncodings('gzip', 'compress'), 'gzip')
})

test('when Accept-Encoding is not populated', t => {
  const req = t.context
  t.deepEqual(req.acceptsEncodings(), ['identity'])
  t.is(req.acceptsEncodings('gzip', 'deflate', 'identity'), 'identity')
})

test('with multiple arguments', t => {
  const req = t.context
  req.headers['accept-encoding'] = 'gzip, compress;q=0.2'
  t.is(req.acceptsEncodings('compress', 'gzip'), 'gzip')
  t.is(req.acceptsEncodings('gzip', 'compress'), 'gzip')
})

test('with an array', t => {
  const req = t.context
  req.headers['accept-encoding'] = 'gzip, compress;q=0.2'
  t.is(req.acceptsEncodings(['compress', 'gzip']), 'gzip')
})
