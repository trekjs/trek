import test from 'ava'
import { response } from '../helpers/context'

test.beforeEach(t => {
  t.context = response()
})

test('res.type= with a mime should set the Content-Type', t => {
  const res = t.context
  res.type = 'text/plain'
  t.is(res.type, 'text/plain')
  t.is(res.header['content-type'], 'text/plain; charset=utf-8')
})

test('res.type= with an extension should lookup the mime', t => {
  const res = t.context
  res.type = 'json'
  t.is(res.type, 'application/json')
  t.is(res.header['content-type'], 'application/json; charset=utf-8')
})

test('res.type= without a charset should default the charset', t => {
  const res = t.context
  res.type = 'text/html'
  t.is(res.type, 'text/html')
  t.is(res.header['content-type'], 'text/html; charset=utf-8')
})

test('res.type= with a charset should not default the charset', t => {
  const res = t.context
  res.type = 'text/html; charset=foo'
  t.is(res.type, 'text/html')
  t.is(res.header['content-type'], 'text/html; charset=foo')
})

test('res.type= with an unknown extension should not set a content-type', t => {
  const res = t.context
  res.type = 'asdf'
  t.is(res.type, '')
  t.true(res.header['content-type'] === undefined)
})

test('res.type with no Content-Type should return ""', t => {
  const res = t.context
  t.is(res.type, '')
})

test('res.type with a Content-Type should return the mime', t => {
  const res = t.context
  res.type = 'json'
  t.is(res.type, 'application/json')
})
