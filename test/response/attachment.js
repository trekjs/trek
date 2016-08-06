import http from 'http'
import test from 'ava'
import Trek from '../../lib/trek'
import { response } from '../helpers/context'

test('res.attachment([filename]) when given a filename should set the filename param', t => {
  const res = response()
  res.attachment('path/to/tobi.png')
  const str = 'attachment; filename="tobi.png"'
  t.is(res.header['content-disposition'], str)
})

test('res.attachment([filename]) when omitting filename should not set filename param', t => {
  const res = response()
  res.attachment()
  t.is(res.header['content-disposition'], 'attachment')
})

test('res.attachment([filename]) when given a no-ascii filename should set the encodeURI filename param', t => {
  const res = response()
  res.attachment('path/to/include-no-ascii-char-中文名-ok.png')
  const str = 'attachment; filename="include-no-ascii-char-???-ok.png"; filename*=UTF-8\'\'include-no-ascii-char-%E4%B8%AD%E6%96%87%E5%90%8D-ok.png'
  t.is(res.header['content-disposition'], str)
})

test.cb('res.attachment([filename]) when given a no-ascii filename should work with http client', t => {
  const app = new Trek()

  app.use(({ res }) => {
    res.attachment('path/to/include-no-ascii-char-中文名-ok.json')
    res.send(200, { foo: 'bar' })
  })

  app.run(function () {
    const address = this.address()
    http.get({
      host: 'localhost',
      path: '/',
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
        t.is(res.headers['content-disposition'], 'attachment; filename="include-no-ascii-char-???-ok.json"; filename*=UTF-8\'\'include-no-ascii-char-%E4%B8%AD%E6%96%87%E5%90%8D-ok.json')
        t.deepEqual(JSON.parse(buf), { foo: 'bar' })
        t.end()
      })
    })
  })
})
