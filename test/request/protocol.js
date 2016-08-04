import test from 'ava'
import { request } from '../helpers/context'

test('when encrypted', t => {
  const req = request()
  req.req.socket = { encrypted: true }
  t.is(req.protocol, 'https')
})

test('when unencrypted', t => {
  const req = request()
  req.req.socket = {}
  t.is(req.protocol, 'http')
})

test('when X-Forwarded-Proto is set and proxy is trusted', t => {
  const req = request()
  req.config.set('trust proxy', true)
  req.req.socket = {}
  req.header['x-forwarded-proto'] = 'https, http'
  t.is(req.protocol, 'https')
})

test('when X-Forwarded-Proto is set and X-Forwarded-Proto is empty', t => {
  const req = request()
  req.config.set('trust proxy', true)
  req.req.socket = {}
  req.header['x-forwarded-proto'] = ''
  t.is(req.protocol, 'http')
})

test('when X-Forwarded-Proto is set and proxy is not trusted', t => {
  const req = request()
  req.req.socket = {}
  req.header['x-forwarded-proto'] = 'https, http'
  t.is(req.protocol, 'http')
})
