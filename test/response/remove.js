import test from 'ava'
import { response } from '../helpers/context'

test.beforeEach(async t => {
  t.context = await response()
})

test('res.remove(name) should remove a field', t => {
  const res = t.context
  res.set('x-foo', 'bar')
  res.remove('x-foo')
  t.deepEqual(res.header, {})
})
