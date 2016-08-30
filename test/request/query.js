import test from 'ava'
import { request } from '../helpers/context'

test('when missing should return an empty object', async t => {
  const req = await request({ url: '/' })
  t.deepEqual(req.query, {})
})

test('when missing should return the same object each time test\'s accessed', async t => {
  const req = await request({ url: '/' })
  req.query.a = '2'
  t.is(req.query.a, '2')
})

test('when missing should return a parsed query-string', async t => {
  const req = await request({ url: '/?page=2' })
  t.is(req.query.page, '2')
})

test('req.query= should stringify and replace the querystring and search', async t => {
  const req = await request({ url: '/store/shoes' })
  req.query = { page: 2, color: 'blue' }
  t.is(req.url, '/store/shoes?page=2&color=blue')
  t.is(req.querystring, 'page=2&color=blue')
  t.is(req.search, '?page=2&color=blue')
})

test('req.query= should change .url but not .originalUrl', async t => {
  const req = await request({ url: '/store/shoes' })
  req.query = { page: 2 }
  t.is(req.url, '/store/shoes?page=2')
  t.is(req.originalUrl, '/store/shoes')
  t.is(req.req.originalUrl, '/store/shoes')
})
