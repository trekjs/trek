import test from 'ava'
import { request } from '../helpers/context'

test('req.secure should return true when encrypted', async t => {
  const req = await request()
  req.req.socket = { encrypted: true }
  t.true(req.secure)
})
