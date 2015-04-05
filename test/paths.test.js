import '../src/Trek';
import Paths from '../src/Paths';

var paths = new Paths(__dirname + '/fixtures');

console.log(paths.get('app'));
console.log(paths.get('app/services'));
console.log(paths.get('config/app'));
console.log(paths.get('config/app.env'));
console.log(paths.get('config/.env'));
console.log(paths.get('config/.env.env'));
console.log(paths.get('config/routes'));
