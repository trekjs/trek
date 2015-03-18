import thenifyAll from 'thenify-all';
import bcrypt from 'bcrypt';

thenifyAll(bcrypt, module.exports, [
  'genSalt',
  'compare',
  'hash'
]);
