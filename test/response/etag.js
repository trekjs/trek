import test from 'ava'
import { response } from '../helpers/context'

test('res.etag= should not modify an etag with quotes', t => {
  const res = response()
  res.etag = '"asdf"'
  t.is(res.header.etag, '"asdf"')
})

test('res.etag= should not modify a weak etag', t => {
  const res = response()
  res.etag = 'W/"asdf"'
  t.is(res.header.etag, 'W/"asdf"')
})

test('res.etag= should add quotes around an etag if necessary', t => {
  const res = response()
  res.etag = 'asdf'
  t.is(res.header.etag, '"asdf"')
})

test('res.etag should return etag', t => {
  const res = response()
  res.etag = '"asdf"'
  t.is(res.etag, '"asdf"')
})
