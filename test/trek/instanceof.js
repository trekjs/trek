import test from 'ava'
import Engine from 'trek-engine'
import Trek from '../../lib/trek'

test('should instanceof Engine', t => {
  const app = new Trek()
  t.true(app instanceof Trek)
  t.true(app instanceof Engine)
})
