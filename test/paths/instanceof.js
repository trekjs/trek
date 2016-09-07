import test from 'ava'
import Paths from '../../lib/paths'

test('should instanceof Paths', t => {
  const p = new Paths()
  t.true(p instanceof Paths)
})
