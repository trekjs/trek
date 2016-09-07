import test from 'ava'
import request from 'request-promise'
import Trek from '../../'
import { listen } from '../helpers/context'

test('if response not finished should return 404', async t => {
  const app = new Trek()

  await app.initialize(false)

  const url = await listen(app)
  try {
    await request(url)
  } catch (err) {
    t.true(err.statusCode === 404)
  }
})
