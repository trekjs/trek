import test from 'ava'
import { request } from '../helpers/context'

test('with no request.req present', t => {
  const req = request()
  req.method = 'GET'
  delete req.req
  t.true(undefined === req.inspect())
})

test('should return a json representation', t => {
  const req = request()
  req.method = 'GET'
  req.url = 'example.com'
  req.header.host = 'example.com'

  t.deepEqual(req.inspect(), {
    method: 'GET',
    url: 'example.com',
    header: {
      host: 'example.com'
    }
  })
})
