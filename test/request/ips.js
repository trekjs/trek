import test from 'ava'
import { request } from '../helpers/context'

test('req.ips when X-Forwarded-For is present and proxy is not trusted should be ignored', async t => {
  const req = await request()
  req.config.set('trust proxy', false)
  req.header['x-forwarded-for'] = '127.0.0.1,127.0.0.2'
  t.deepEqual(req.ips, [])
})

test('req.ips when X-Forwarded-For is present and proxy is trusted should be used', async t => {
  const req = await request()
  req.config.set('trust proxy', true)
  req.header['x-forwarded-for'] = '127.0.0.1,127.0.0.2'
  t.deepEqual(req.ips, ['127.0.0.1', '127.0.0.2'])
})
