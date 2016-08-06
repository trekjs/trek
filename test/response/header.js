import test from 'ava'
import { response } from '../helpers/context'

test('res.header should return the response header object', t => {
  const res = response()
  res.set('X-Foo', 'bar')
  t.deepEqual(res.header, { 'x-foo': 'bar' })
})

test('res.header when res._headers not present should return empty object', t => {
  const res = response()
  res.res._headers = null
  t.deepEqual(res.header, {})
})
