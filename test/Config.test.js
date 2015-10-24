import co from 'co'
import assert from 'power-assert'
import '../src/Trek'
import Parsers from '../src/Parsers'
import Paths from '../src/Paths'
import Config from '../src/Config'

describe('Config', () => {

  var config

  before(() => {
    return co(function *() {
      config = new Config(__dirname + '/fixtures')
      yield config.load()
    })
  })

  describe('#parsers', () => {

    it('should be inited', () => {
      assert(config.parsers === Parsers)
    })

  })

  describe('#paths', () => {

    it('should be inited', () => {
      assert(config.paths !== null)
    })

    it('should be a Paths instance', () => {
      assert(config.paths instanceof Paths)
    })

  })

  describe('#stores', () => {

    it('should be inited', () => {
      assert(config.stores !== null)
    })

    it('should be a Map instance', () => {
      assert(config.stores instanceof Map)
    })

  })

  describe('#list', () => {

    it('should be list', () => {
      assert(config.list !== null)
    })

    it('should be a Array instance', () => {
      assert(config.list instanceof Array)
    })

    it('should not be an empty array', () => {
      assert(config.list.length > 0)
    })


  })

  describe('#get()', () => {

    it('should return $PATH from env', () => {
      assert(config.get('PATH').length !== 0)
      assert(config.get('PORT') === 377)
    })

    it('should return a secret key from secrets.yml', () => {
      assert(config.get('secrets.secret_key') === 'Oabah4p')
    })

  })

  describe('#set()', () => {

    it('should return new value when reseting', () => {
      assert(config.get('owner.age') === 144);
      config.set('owner.age', 233)
      assert(config.get('owner.age') === 233)
    })

  })

})

