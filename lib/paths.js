import globby from 'globby'

export default class Paths {

  constructor (root) {
    this.root = root
    this.blueprint = new Map()
  }

  set (key, value) {
    this.blueprint.set(key, value || key)
    return this
  }

  async get (key, absolute = false) {
    const value = this.blueprint.get(key) || key
    let matched = value.matched
    if (matched && matched.length) {
      return matched
    }

    const pattern = value.glob || (value.single ? key : value)
    const result = await globby(pattern, { realpath: absolute, cwd: this.root })
    matched = value.matched = value.single ? result[0] : result
    this.set(key, value)
    return matched
  }

  async getAll (absolute = false) {
    const result = Object.create(null)
    for (const key of this.blueprint.keys()) {
      result[key] = await this.get(key, absolute) // eslint-disable-line babel/no-await-in-loop
    }
    return result
  }

  async globby (pattern, options) {
    return await globby(pattern, options)
  }

}
