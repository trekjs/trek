import test from 'ava'
import { response } from '../helpers/context'

test('res.remove(name) should remove a field', t => {
  const res = response()
  res.set('x-foo', 'bar')
  res.remove('x-foo')
  t.deepEqual(res.header, {})
})
