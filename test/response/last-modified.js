import test from 'ava'
import { response } from '../helpers/context'

test('res.lastModified should set the header as a UTCString', t => {
  const res = response()
  const date = new Date()
  res.lastModified = date
  t.is(res.header['last-modified'], date.toUTCString())
})

test('res.lastModified should work with date strings', t => {
  const res = response()
  const date = new Date()
  res.lastModified = date.toString()
  t.is(res.header['last-modified'], date.toUTCString())
})

test('res.lastModified should get the header as a Date', t => {
  // Note: Date() removes milliseconds, but it's practically important.
  const res = response()
  const date = new Date()
  res.lastModified = date
  t.is(res.lastModified.getTime() / 1000, Math.floor(date.getTime() / 1000))
})

test('res.lastModified when lastModified not set should get undefined', t => {
  const res = response()
  t.true(res.lastModified === undefined)
})
