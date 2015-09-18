import Module from 'module';
import toml from 'toml';
import yaml from 'js-yaml';
import hjson from 'hjson';
import * as babel from 'babel';

const BabelParser = {

  parse(content = '', filename = '') {
    let o = babel.transform(content);
    let m = new Module(filename);
    m._compile(o.code, filename);
    return m.exports;
  }

};

const YAMLParser = {

  parse(content = '', filename = '') {
    return yaml.safeLoad(content);
  }

};

const Parsers = {

  toml,

  yml: YAMLParser,

  json: hjson,

  js: BabelParser

};

export default Parsers;
