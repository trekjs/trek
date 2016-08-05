import test from 'ava'
import { request } from '../helpers/context'

test('req.secure should return true when encrypted', t => {
  const req = request()
  req.req.socket = { encrypted: true }
  t.true(req.secure)
})
