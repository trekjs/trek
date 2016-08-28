import test from 'ava'
import { response } from '../helpers/context'

test.beforeEach(async t => {
  t.context = await response()
})

test('res.is(type) should ignore params', t => {
  const res = t.context
  res.type = 'text/html; charset=utf-8'

  t.is(res.is('text/*'), 'text/html')
})

test('res.is(type) when no type is set should return false', t => {
  const res = t.context

  t.false(res.is())
  t.false(res.is('html'))
})

test('res.is(type) give no types should return the type', t => {
  const res = t.context
  res.type = 'text/html; charset=utf-8'

  t.is(res.is(), 'text/html')
})

test('res.is(type) given one type should return the type or false', t => {
  const res = t.context
  res.type = 'image/png'

  t.is(res.is('png'), 'png')
  t.is(res.is('.png'), '.png')
  t.is(res.is('image/png'), 'image/png')
  t.is(res.is('image/*'), 'image/png')
  t.is(res.is('*/png'), 'image/png')

  t.false(res.is('jpeg'))
  t.false(res.is('.jpeg'))
  t.false(res.is('image/jpeg'))
  t.false(res.is('text/*'))
  t.false(res.is('*/jpeg'))
})

test('res.is(type) given multiple types should return the first match or false', t => {
  const res = t.context
  res.type = 'image/png'

  t.is(res.is('png'), 'png')
  t.is(res.is('.png'), '.png')
  t.is(res.is('text/*', 'image/*'), 'image/png')
  t.is(res.is('image/*', 'text/*'), 'image/png')
  t.is(res.is('image/*', 'image/png'), 'image/png')
  t.is(res.is('image/png', 'image/*'), 'image/png')

  t.is(res.is(['text/*', 'image/*']), 'image/png')
  t.is(res.is(['image/*', 'text/*']), 'image/png')
  t.is(res.is(['image/*', 'image/png']), 'image/png')
  t.is(res.is(['image/png', 'image/*']), 'image/png')

  t.false(res.is('jpeg'))
  t.false(res.is('.jpeg'))
  t.false(res.is('text/*', 'application/*'))
  t.false(res.is('text/html', 'text/plain', 'application/json; charset=utf-8'))
})

test('res.is(type) when Content-Type: application/x-www-form-urlencoded should match "urlencoded"', t => {
  const res = t.context
  res.type = 'application/x-www-form-urlencoded'

  t.is(res.is('urlencoded'), 'urlencoded')
  t.is(res.is('json', 'urlencoded'), 'urlencoded')
  t.is(res.is('urlencoded', 'json'), 'urlencoded')
})
