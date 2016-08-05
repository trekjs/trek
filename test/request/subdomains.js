import test from 'ava'
import { request } from '../helpers/context'

test('req.subdomains should return subdomain array', t => {
  const req = request()
  req.header.host = 'tobi.ferrets.example.com'
  req.config.set('subdomain offset', 2)
  t.deepEqual(req.subdomains, ['ferrets', 'tobi'])

  req.config.set('subdomain offset', 3)
  t.deepEqual(req.subdomains, ['tobi'])
})

test('req.subdomains with no host present', t => {
  const req = request()
  t.deepEqual(req.subdomains, [])
})
