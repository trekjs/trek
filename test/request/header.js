import test from 'ava'
import { request } from '../helpers/context'

test.beforeEach(async t => {
  t.context = await request()
})

test('should return the request header object', t => {
  const req = t.context
  t.is(req.header, req.headers)
})
