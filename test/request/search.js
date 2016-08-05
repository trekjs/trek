import test from 'ava'
import context from '../helpers/context'

test('req.search= should replace the search', t => {
  const req = context({ url: '/store/shoes' }).req
  req.search = '?page=2&color=blue'
  t.is(req.url, '/store/shoes?page=2&color=blue')
  t.is(req.search, '?page=2&color=blue')
})

test('req.search= should update req.querystring and req.query', t => {
  const req = context({ url: '/store/shoes' }).req
  req.search = '?page=2&color=blue'
  t.is(req.url, '/store/shoes?page=2&color=blue')
  t.is(req.querystring, 'page=2&color=blue')
  t.is(req.query.page, '2')
  t.is(req.query.color, 'blue')
})

test('req.search= should change .url but not .originalUrl', t => {
  const req = context({ url: '/store/shoes' }).req
  req.search = '?page=2&color=blue'
  t.is(req.url, '/store/shoes?page=2&color=blue')
  t.is(req.originalUrl, '/store/shoes')
  t.is(req.req.originalUrl, '/store/shoes')
})

test('when missing should return ""', t => {
  const req = context({ url: '/store/shoes' }).req
  t.is(req.search, '')
})
