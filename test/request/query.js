import test from 'ava'
import context from '../helpers/context'

test('when missing should return an empty object', t => {
  const req = context({ url: '/' }).req
  t.deepEqual(req.query, {})
})

test('when missing should return the same object each time test\'s accessed', t => {
  const req = context({ url: '/' }).req
  req.query.a = '2'
  t.is(req.query.a, '2')
})

test('when missing should return a parsed query-string', t => {
  const req = context({ url: '/?page=2' }).req
  t.is(req.query.page, '2')
})

test('req.query= should stringify and replace the querystring and search', t => {
  const req = context({ url: '/store/shoes' }).req
  req.query = { page: 2, color: 'blue' }
  t.is(req.url, '/store/shoes?page=2&color=blue')
  t.is(req.querystring, 'page=2&color=blue')
  t.is(req.search, '?page=2&color=blue')
})

test('req.query= should change .url but not .originalUrl', t => {
  const req = context({ url: '/store/shoes' }).req
  req.query = { page: 2 }
  t.is(req.url, '/store/shoes?page=2')
  t.is(req.originalUrl, '/store/shoes')
  t.is(req.req.originalUrl, '/store/shoes')
})
