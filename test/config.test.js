import '../src/Trek';
import Config from '../src/Config';

var config = new Config(__dirname + '/fixtures');

console.log(config.get('PATH'));
console.log(config.get('PORT'));
console.log(config.get('HOST'));
console.log(config.get('owner.name'));
console.log(config.get('owner.bio'));
console.dir(config.get('owner.dob').toISOString());
console.log(config.get('title'));

config.set('owner.age', 233);
console.log(config.get('owner.age'));
console.log(config.get('owner.url'));
