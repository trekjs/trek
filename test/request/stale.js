import test from 'ava'
import context from '../helpers/context'

test('req.stale should be the inverse of req.fresh', async t => {
  const { req, res } = await context()
  res.status = 200
  req.method = 'GET'
  req.headers['if-none-match'] = '"123"'
  res.set('ETag', '"123"')
  t.true(req.fresh)
  t.false(req.stale)
})
