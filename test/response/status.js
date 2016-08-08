import assert from 'assert'
import { STATUS_CODES as statuses } from 'http'
import test from 'ava'
import { response } from '../helpers/context'

test('res.status= when a status code and valid should set the status', t => {
  const res = response()
  res.status = 403
  t.is(res.status, 403)
})

test('res.status= when a status code and valid should not throw', () => {
  assert.doesNotThrow(() => {
    response().status = 403
  })
})

test('res.status= when a status code and invalid should throw', t => {
  t.throws(() => {
    response().status = 999
  }, 'invalid status code: 999')
})

test('res.status= when a status code and custom status', () => {
  test.before(() => {
    statuses['700'] = 'custom status'
  })

  test('res.status= when a status code and custom status should set the status', t => {
    const res = response()
    res.status = 700
    t.is(res.status, 700)
  })

  test('res.status= when a status code and custom status should not throw', t => {
    t.notThrows(() => {
      response().status = 700
    })
  })
})

test('res.status= when a status string should throw', () => {
  assert.throws(() => {
    response().status = 'forbidden'
  }, 'code must be a number')
})
