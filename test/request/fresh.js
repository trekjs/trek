import test from 'ava'
import { request } from '../helpers/context'

test.beforeEach(async t => {
  t.context = await request()
})

test('the request method is not GET and HEAD', t => {
  const req = t.context
  req.method = 'POST'
  t.false(req.fresh)
})

test('the response is non-2xx', t => {
  const req = t.context
  req.res.status = 404
  req.method = 'GET'
  req.headers['if-none-match'] = '123'
  req.res.set('ETag', '123')
  t.false(req.fresh)
})

test('the response is 2xx and etag matches', t => {
  const req = t.context
  req.res.status = 200
  req.method = 'GET'
  req.headers['if-none-match'] = '123'
  req.res.set('ETag', '123')
  t.true(req.fresh)
})

test('the response is 2xx and etag do not match', t => {
  const req = t.context
  req.res.status = 200
  req.method = 'GET'
  req.headers['if-none-match'] = '123'
  req.res.set('ETag', 'hey')
  t.false(req.fresh)
})
