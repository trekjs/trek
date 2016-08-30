import test from 'ava'
import { request } from '../helpers/context'

test('req.type should return type void of parameters', async t => {
  const req = await request()
  req.header['content-type'] = 'text/html; charset=utf-8'
  t.is(req.type, 'text/html')
})

test('req.type should with no host present', async t => {
  const req = await request()
  t.true('' === req.type)
})
