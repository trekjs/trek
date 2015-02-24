import MiddlewareStackProxy from './middleware_stack_proxy';
import Generators from './generators';
import {Root} from '../paths';

class Configuration {

  contructor(root) {
    this._root = root;
  }

  get middleware() {
    return this._middleware ?= new MiddlewareStackProxy()
  }

  get generators() {
    return this._generators ?= new Generators();
  }

  get paths() {
    this._paths ?= generatePaths(this._root);
  }

  set root(value) {
    this._root = this._paths.path = path.dirname(value);
  }

}

var generatePaths= (root) => {
  let paths = new Root(root);

  paths.add('app');
  paths.add('app/controllers');
  paths.add('app/helpers');
  paths.add('app/models');
  paths.add('app/views');

  paths.add('lib');

  paths.add('config');
  //paths.add('config/environments', { glob: `${process.env.}.js` });
  paths.add('config/routes.js');

  return paths;
};

export default Configuration;
