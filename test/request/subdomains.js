import test from 'ava'
import { request } from '../helpers/context'

test('req.subdomains should return subdomain array', async t => {
  const req = await request()
  req.header.host = 'tobi.ferrets.example.com'
  req.config.set('subdomain offset', 2)
  t.deepEqual(req.subdomains, ['ferrets', 'tobi'])

  req.config.set('subdomain offset', 3)
  t.deepEqual(req.subdomains, ['tobi'])
})

test('req.subdomains with no host present', async t => {
  const req = await request()
  t.deepEqual(req.subdomains, [])
})
