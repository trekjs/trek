import test from 'ava'
import { request } from '../helpers/context'

test.beforeEach(async t => {
  t.context = await request()
})

test('with no arguments when Accept-Language is populated', t => {
  const req = t.context
  req.headers['accept-language'] = 'en;q=0.8, es, pt'
  t.deepEqual(req.acceptsLanguages(), ['es', 'pt', 'en'])
})

test('with multiple arguments when Accept-Language is populated', t => {
  const req = t.context
  req.headers['accept-language'] = 'en;q=0.8, es, pt'
  t.is(req.acceptsLanguages('es', 'en'), 'es')
})

test('if no types match', t => {
  const req = t.context
  req.headers['accept-language'] = 'en;q=0.8, es, pt'
  t.false(req.acceptsLanguages('fr', 'au'))
})

test('when Accept-Language is not populated', t => {
  const req = t.context
  t.is(req.acceptsLanguages('es', 'en'), 'es')
})

test('with an array', t => {
  const req = t.context
  req.headers['accept-language'] = 'en;q=0.8, es, pt'
  t.is(req.acceptsLanguages(['es', 'en']), 'es')
})
