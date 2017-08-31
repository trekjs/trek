const globby = require('globby')

module.exports = class Paths {
  constructor(root) {
    this.root = root
    this.blueprint = new Map()
  }

  set(key, value) {
    this.blueprint.set(key, value || key)
    return this
  }

  async get(key, absolute = false) {
    const value = this.blueprint.get(key) || key
    let matched = value.matched
    if (matched && matched.length > 0) {
      return matched
    }

    const pattern = value.glob || (value.single ? key : value)
    const result = await globby(pattern, { realpath: absolute, cwd: this.root })
    matched = (value.matched = value.single) ? result[0] : result
    this.set(key, value)
    return matched
  }

  async getAll(absolute = false) {
    const result = Object.create(null)
    const keys = Array.from(this.blueprint.keys())
    const arr = await Promise.all(keys.map(k => this.get(k, absolute)))
    for (const [i, k] of keys) {
      result[k] = arr[i]
    }
    return result
  }

  globby(pattern, options) {
    return globby(pattern, options)
  }
}
