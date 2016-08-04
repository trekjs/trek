import test from 'ava'
import context from '../helpers/context'

test.beforeEach(t => {
  t.context = context().req
})

test('req.is(type) should ignore params', t => {
  const req = t.context
  req.header['content-type'] = 'text/html; charset=utf-8'
  req.header['transfer-encoding'] = 'chunked'

  t.is(req.is('text/*'), 'text/html')
})

test('when no body is given should return null', t => {
  const req = t.context

  t.true(null === req.is())
  t.true(null === req.is('image/*'))
  t.true(null === req.is('image/*', 'text/*'))
})

test('when no content type is given should return false', t => {
  const req = t.context
  req.header['transfer-encoding'] = 'chunked'

  t.false(req.is())
  t.false(req.is('image/*'))
  t.false(req.is('text/*', 'image/*'))
})

test('give no types should return the mime type', t => {
  const req = t.context
  req.header['content-type'] = 'image/png'
  req.header['transfer-encoding'] = 'chunked'

  t.is(req.is(), 'image/png')
})

test('given one type should return the type or false', t => {
  const req = t.context
  req.header['content-type'] = 'image/png'
  req.header['transfer-encoding'] = 'chunked'

  t.is(req.is('png'), 'png')
  t.is(req.is('.png'), '.png')
  t.is(req.is('image/png'), 'image/png')
  t.is(req.is('image/*'), 'image/png')
  t.is(req.is('*/png'), 'image/png')

  t.false(req.is('jpeg'))
  t.false(req.is('.jpeg'))
  t.false(req.is('image/jpeg'))
  t.false(req.is('text/*'))
  t.false(req.is('*/jpeg'))
})

test('given multiple types should return the first match or false', t => {
  const req = t.context
  req.header['content-type'] = 'image/png'
  req.header['transfer-encoding'] = 'chunked'

  t.is(req.is('png'), 'png')
  t.is(req.is('.png'), '.png')
  t.is(req.is('text/*', 'image/*'), 'image/png')
  t.is(req.is('image/*', 'text/*'), 'image/png')
  t.is(req.is('image/*', 'image/png'), 'image/png')
  t.is(req.is('image/png', 'image/*'), 'image/png')

  t.is(req.is(['text/*', 'image/*']), 'image/png')
  t.is(req.is(['image/*', 'text/*']), 'image/png')
  t.is(req.is(['image/*', 'image/png']), 'image/png')
  t.is(req.is(['image/png', 'image/*']), 'image/png')

  t.false(req.is('jpeg'))
  t.false(req.is('.jpeg'))
  t.false(req.is('text/*', 'application/*'))
  t.false(req.is('text/html', 'text/plain', 'application/json; charset=utf-8'))
})

test('when Content-Type: application/x-www-form-urlencoded should match "urlencoded"', t => {
  const req = t.context
  req.header['content-type'] = 'application/x-www-form-urlencoded'
  req.header['transfer-encoding'] = 'chunked'

  t.is(req.is('urlencoded'), 'urlencoded')
  t.is(req.is('json', 'urlencoded'), 'urlencoded')
  t.is(req.is('urlencoded', 'json'), 'urlencoded')
})
