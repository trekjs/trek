/*!
 * trek
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

var fs = require('fs');
var babelrc = JSON.parse(fs.readFileSync('.babelrc', 'utf8'));

babelrc.ignore = new RegExp('node_modules');

require('babel/register')(babelrc);

module.exports = require('./lib/trek');
