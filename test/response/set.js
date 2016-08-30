import test from 'ava'
import { response } from '../helpers/context'

test.beforeEach(async t => {
  t.context = await response()
})

test('res.set(name, val) should set a field value', t => {
  const res = t.context
  res.set('x-foo', 'bar')
  t.is(res.header['x-foo'], 'bar')
})

test('res.set(name, val) should coerce to a string', t => {
  const res = t.context
  res.set('x-foo', 5)
  t.is(res.header['x-foo'], '5')
})

test('res.set(name, val) should set a field value of array', t => {
  const res = t.context
  res.set('x-foo', ['foo', 'bar'])
  t.deepEqual(res.header['x-foo'], ['foo', 'bar'])
})

test('res.set(object) should set multiple fields', t => {
  const res = t.context

  res.set({
    foo: '1',
    bar: '2'
  })

  t.is(res.header.foo, '1')
  t.is(res.header.bar, '2')
})
