/*!
 * trek - Parsers
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import Module from 'module'
import toml from 'toml'
import yaml from 'js-yaml'
import json from 'hjson'
import * as babel from 'babel'

const js = {

  parse(content = '', filename = '') {
    let o = babel.transform(content)
    let m = new Module(filename)
    m._compile(o.code, filename)
    return m.exports
  }

}

const yml = {

  parse(content = '', filename = '') {
    return yaml.safeLoad(content)
  }

}

/**
 * Includes `toml`, `yml`, `json`, `js` Parsers
 * @namespace Parsers
 */
export default {

  toml,

  yml,

  json,

  js

}
