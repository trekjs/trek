require('babel/register')({
  experimental: true,
  playground: true,
  blacklist: [
    'regenerator',
    'es6.blockScoping',
    'es6.constants',
    'es6.templateLiterals'
  ]
});