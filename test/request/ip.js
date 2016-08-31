import Stream from 'stream'
import test from 'ava'
import Trek from '../../lib/trek'
import { request } from '../helpers/context'

test('with req.ips present should return req.ips[0]', async t => {
  const app = new Trek()

  await app.initialize(false)

  app.config.set('trust proxy', true)
  const rawReq = { headers: {}, socket: new Stream.Duplex() }
  rawReq.headers['x-forwarded-for'] = '127.0.0.1'
  rawReq.socket.remoteAddress = '127.0.0.2'
  const req = await request(rawReq, undefined, app)
  t.is(req.ip, '127.0.0.1')
})

test('with no req.ips present should return req.socket.remoteAddress', async t => {
  const rawReq = { socket: new Stream.Duplex() }
  rawReq.socket.remoteAddress = '127.0.0.2'
  const req = await request(rawReq)
  t.is(req.ip, '127.0.0.2')
})

test('with no req.ips present with req.socket.remoteAddress not present should return an empty string', async t => {
  const socket = new Stream.Duplex()
  Object.defineProperty(socket, 'remoteAddress', {
    get: () => undefined, // So that the helper doesn't override it with a reasonable value
    set: () => {}
  })
  t.is((await request({ socket })).ip, '')
})

test('req.ip should be cached', async t => {
  const rawReq = { socket: new Stream.Duplex() }
  rawReq.socket.remoteAddress = '127.0.0.2'
  const req = await request(rawReq)
  rawReq.socket.remoteAddress = '127.0.0.1'
  t.is(req.ip, '127.0.0.2')
})
