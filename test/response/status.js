import assert from 'assert'
import { STATUS_CODES as statuses } from 'http'
import test from 'ava'
import { response } from '../helpers/context'

test.beforeEach(async t => {
  t.context = await response()
})

test('res.status= when a status code and valid should set the status', t => {
  const res = t.context
  res.status = 403
  t.is(res.status, 403)
})

test('res.status= when a status code and valid should not throw', t => {
  const res = t.context
  assert.doesNotThrow(() => {
    res.status = 403
  })
})

test('res.status= when a status string should throw', t => {
  const res = t.context
  assert.throws(() => {
    res.status = 'forbidden'
  }, 'code must be a number')
})

test('res.status= when a status code and invalid should throw', t => {
  const res = t.context
  t.throws(() => {
    res.status = 999
  }, 'invalid status code: 999')
})

test.before(() => {
  statuses['700'] = 'custom status'
})

test('res.status= when a status code and custom status should set the status', t => {
  const res = t.context
  res.status = 700
  t.is(res.status, 700)
})

test('res.status= when a status code and custom status should not throw', t => {
  const res = t.context
  t.notThrows(() => {
    res.status = 700
  })
})
