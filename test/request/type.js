import test from 'ava'
import { request } from '../helpers/context'

test('req.type should return type void of parameters', t => {
  const req = request()
  req.header['content-type'] = 'text/html; charset=utf-8'
  t.is(req.type, 'text/html')
})

test('req.type should with no host present', t => {
  const req = request()
  t.true('' === req.type)
})
