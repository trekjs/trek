import test from 'ava'
import { response } from '../helpers/context'

test.beforeEach(async t => {
  t.context = await response()
})

test('res.header should return the response header object', t => {
  const res = t.context
  res.set('X-Foo', 'bar')
  t.deepEqual(res.header, { 'x-foo': 'bar' })
})

test('res.header when res._headers not present should return empty object', t => {
  const res = t.context
  res.res._headers = null
  t.deepEqual(res.header, {})
})
