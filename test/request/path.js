import test from 'ava'
import parse from 'parseurl'
import { request } from '../helpers/context'

test.beforeEach(async t => {
  t.context = await request()
})

test('ctx.path should return the pathname', t => {
  const req = t.context
  req.url = '/login?next=/dashboard'
  t.is(req.path, '/login')
})

test('ctx.path= should set the pathname', t => {
  const req = t.context
  req.url = '/login?next=/dashboard'

  req.path = '/logout'
  t.is(req.path, '/logout')
  t.is(req.url, '/logout?next=/dashboard')
})

test('ctx.path= should change .url but not .originalUrl', async t => {
  const req = await request({ url: '/login' })
  req.path = '/logout'
  t.is(req.url, '/logout')
  t.is(req.originalUrl, '/login')
  t.is(req.req.originalUrl, '/login')
})

test('ctx.path= should not affect parseurl', async t => {
  const req = await request({ url: '/login?foo=bar' })
  req.path = '/login'
  const url = parse(req)
  t.is(url.path, '/login?foo=bar')
})
