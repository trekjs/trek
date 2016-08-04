import test from 'ava'
import { request } from '../helpers/context'

test('when the request method is idempotent', t => {
  ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'].forEach(check)
  function check (method) {
    const req = request()
    req.method = method
    t.is(req.idempotent, true)
  }
})

test('when the request method is not idempotent', t => {
  const req = request()
  req.method = 'POST'
  t.false(req.idempotent)
})
