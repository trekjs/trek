import assert  from 'power-assert'
import co from 'co'
import Trek from '../src/Trek'
import request from 'supertest'

describe('Trek', () => {

  describe('.env', () => {

    it('should return test', () => {
      assert(Trek.env === 'test')
    })

    it('should be not development env', () => {
      assert(Trek.isDevelopment === false)
    })

    it('should be test env', () => {
      assert(Trek.isTest === true)
    })

    it('should be not production env', () => {
      assert(Trek.isProduction === false)
    })

  })

  describe('.package', () => {

    it('should return package object', () => {
      assert(Trek.package !== null)
    })

    it('should return version string', () => {
      assert(Trek.version !== null)
    })

  })

  it('should be a Global object', () => {
    assert(global.Trek === Trek)
  })

})
