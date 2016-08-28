import test from 'ava'
import parseurl from 'parseurl'
import { request } from '../helpers/context'

test('should return the querystring', async t => {
  const req = await request({ url: '/store/shoes?page=2&color=blue' })
  t.is(req.querystring, 'page=2&color=blue')
})

test('when req.req not present should return an empty string', async t => {
  const req = await request()
  req.req = null
  t.is(req.querystring, '')
})

test('req.querystring= should replace the querystring', async t => {
  const req = await request({ url: '/store/shoes' })
  req.querystring = 'page=2&color=blue'
  t.is(req.url, '/store/shoes?page=2&color=blue')
  t.is(req.querystring, 'page=2&color=blue')
})

test('req.querystring= should update req.search and req.query', async t => {
  const req = await request({ url: '/store/shoes' })
  req.querystring = 'page=2&color=blue'
  t.is(req.url, '/store/shoes?page=2&color=blue')
  t.is(req.search, '?page=2&color=blue')
  t.is(req.query.page, '2')
  t.is(req.query.color, 'blue')
})

test('req.querystring= should change .url but not .originalUrl', async t => {
  const req = await request({ url: '/store/shoes' })
  req.querystring = 'page=2&color=blue'
  t.is(req.url, '/store/shoes?page=2&color=blue')
  t.is(req.originalUrl, '/store/shoes')
  t.is(req.req.originalUrl, '/store/shoes')
})

test('req.querystring= should not affect parseurl', async t => {
  const req = await request({ url: '/login?foo=bar' })
  req.querystring = 'foo=bar'
  const url = parseurl(req.req)
  t.is(url.path, '/login?foo=bar')
})
