return;
import StringInquirer from '../src/string_inquirer';

let type = 'development';
let env = new StringInquirer(type);

console.log(env);
console.log(env === 'development');
//console.log(env.is(type));
//console.log(env.is('production'));
