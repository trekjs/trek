/*!
 * trek/king/bcrypt
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

import thenifyAll from 'thenify-all';
import bcrypt from 'bcrypt';

thenifyAll(bcrypt, module.exports, [
  'genSalt',
  'compare',
  'hash'
]);
