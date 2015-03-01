import { Root } from '../src/paths';

let paths = new Root('.');

paths.add('app');
paths.add('app/controllers');
paths.add('app/helpers');
paths.add('app/models');
paths.add('app/views');

paths.add('lib');

paths.add('config');
//paths.add('config/environments', { glob: `${process.env.IOJS_ENV}.js` });
paths.add('config/locales', { glob: '*.{js,yml,json}' });
paths.add('config/routes.js');
paths.get('app/controllers').push('lib/controllers');


for (let v of paths.values) {
  //console.log(v.expanded());
}
