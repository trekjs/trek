import test from 'ava'
import context from '../helpers/context'

test.beforeEach(t => {
  t.context = context().req
})

test('with no arguments when Accept-Charset is populated', t => {
  const req = t.context
  req.headers['accept-charset'] = 'utf-8, iso-8859-1;q=0.2, utf-7;q=0.5'
  t.deepEqual(req.acceptsCharsets(), ['utf-8', 'utf-7', 'iso-8859-1'])
})

test('with multiple arguments when Accept-Charset is populated', t => {
  const req = t.context
  req.headers['accept-charset'] = 'utf-8, iso-8859-1;q=0.2, utf-7;q=0.5'
  t.is(req.acceptsCharsets('utf-7', 'utf-8'), 'utf-8')
})

test('if no types match', t => {
  const req = t.context
  req.headers['accept-charset'] = 'utf-8, iso-8859-1;q=0.2, utf-7;q=0.5'
  t.false(req.acceptsCharsets('utf-16'))
})

test('when Accept-Charset is not populated', t => {
  const req = t.context
  t.is(req.acceptsCharsets('utf-7', 'utf-8'), 'utf-7')
})

test('with an array', t => {
  const req = t.context
  req.headers['accept-charset'] = 'utf-8, iso-8859-1;q=0.2, utf-7;q=0.5'
  t.is(req.acceptsCharsets(['utf-7', 'utf-8']), 'utf-8')
})
