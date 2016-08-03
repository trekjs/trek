import test from 'ava'
import context from '../helpers/context'

test.beforeEach(t => {
  t.context = context().req
})

test('with no arguments when Accept is populated', t => {
  const req = t.context
  req.headers.accept = 'application/*;q=0.2, image/jpeg;q=0.8, text/html, text/plain'
  t.deepEqual(req.accepts(), ['text/html', 'text/plain', 'image/jpeg', 'application/*'])
})

test('with no valid types when Accept is populated', t => {
  const req = t.context
  req.headers.accept = 'application/*;q=0.2, image/jpeg;q=0.8, text/html, text/plain'
  t.false(req.accepts('image/png', 'image/tiff'))
})

test('when Accept is not populated', t => {
  const req = t.context
  t.is(req.accepts('text/html', 'text/plain', 'image/jpeg', 'application/*'), 'text/html')
})

test('when extensions are given', t => {
  const req = t.context
  req.headers.accept = 'text/plain, text/html'
  t.is(req.accepts('html'), 'html')
  t.is(req.accepts('.html'), '.html')
  t.is(req.accepts('txt'), 'txt')
  t.is(req.accepts('.txt'), '.txt')
  t.false(req.accepts('png'))
})

test('when an array is given', t => {
  const req = t.context
  req.headers.accept = 'text/plain, text/html'
  t.is(req.accepts(['png', 'text', 'html']), 'text')
  t.is(req.accepts(['png', 'html']), 'html')
})

test('when multiple arguments are given', t => {
  const req = t.context
  req.headers.accept = 'text/plain, text/html'
  t.is(req.accepts('png', 'text', 'html'), 'text')
  t.is(req.accepts('png', 'html'), 'html')
})

test('when present in Accept as an exact match', t => {
  const req = t.context
  req.headers.accept = 'text/plain, text/html'
  t.is(req.accepts('text/html'), 'text/html')
  t.is(req.accepts('text/plain'), 'text/plain')
})

test('when present in Accept as a type match', t => {
  const req = t.context
  req.headers.accept = 'application/json, */*'
  t.is(req.accepts('text/html'), 'text/html')
  t.is(req.accepts('text/plain'), 'text/plain')
  t.is(req.accepts('image/png'), 'image/png')
})

test('when present in Accept as a subtype match', t => {
  const req = t.context
  req.headers.accept = 'application/json, text/*'
  t.is(req.accepts('text/html'), 'text/html')
  t.is(req.accepts('text/plain'), 'text/plain')
  t.false(req.accepts('image/png'))
})
