import test from 'ava'
import request from 'request-promise'
import Trek from '../../lib/trek'
import { listen } from '../helpers/context'

test('if response not finished should return 200', async t => {
  const app = new Trek()

  await app.bootUp(false)

  const uri = await listen(app)
  const res = await request({ uri, resolveWithFullResponse: true })
  t.is(res.statusCode, 200)
})
