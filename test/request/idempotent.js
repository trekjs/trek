import test from 'ava'
import { request } from '../helpers/context'

test('when the request method is idempotent', async t => {
  ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'].forEach(check)
  async function check (method) {
    const req = await request()
    req.method = method
    t.is(req.idempotent, true)
  }
})

test('when the request method is not idempotent', async t => {
  const req = await request()
  req.method = 'POST'
  t.false(req.idempotent)
})
