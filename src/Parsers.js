import Module from 'module';
import toml from 'toml';
import hjson from 'hjson';
import * as babel from 'babel';

const BabelParser = {

  parse(context = '', filename = '') {
    let o = babel.transform(context);
    let m = new Module(filename);
    m._compile(o.code, filename);
    return m.exports;
  }

};

const Parsers = {

  toml,

  json: hjson,

  js: BabelParser

};

export default Parsers;
