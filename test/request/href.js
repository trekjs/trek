import Stream from 'stream'
import http from 'http'
import test from 'ava'
import Trek from '../../lib/trek'
import context from '../helpers/context'

test('should return the full request url', t => {
  const socket = new Stream.Duplex()
  const rawReq = {
    url: '/users/1?next=/dashboard',
    headers: {
      host: 'localhost'
    },
    socket
  }
  Reflect.setPrototypeOf(rawReq, Stream.Readable.prototype)
  const req = context(rawReq).req
  t.is(req.href, 'http://localhost/users/1?next=/dashboard')
  // change it also work
  req.url = '/foo/users/1?next=/dashboard'
  t.is(req.href, 'http://localhost/users/1?next=/dashboard')
})

test('should work with `GET http://example.com/foo`', t => {
  const app = new Trek()
  app.use(({ req, res }) => {
    res.end(req.href)
  })
  app.run(function () {
    const address = this.address()
    http.get({
      host: 'localhost',
      path: 'http://example.com/foo',
      port: address.port
    }, res => {
      t.is(res.statusCode, 200)
      let buf = ''
      res.setEncoding('utf8')
      res.on('data', s => {
        buf += s
        return buf
      })
      res.on('end', () => {
        t.is(buf, 'http://example.com/foo')
      })
    })
  })
})
