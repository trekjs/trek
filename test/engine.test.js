return
import rt from 'require-times';
import swig from 'koa-swig';
import '../src/Trek';
import Engine from '../src/Engine';

// rt = rt()
// rt.start();

var app = new Engine(__dirname + '/fixtures');

var publicPath = app.paths.get('public', true); // absolute path
var viewsPath = app.paths.get('app/views', true); // absolute path

app.static(publicPath);

app.serveFile('/main.js', publicPath + '/js/main.js');

app.index(publicPath + '/index.html');

app.render = swig({
  root: viewsPath
});

app.get('/users/:id', function* () {
  this.body = this.params;
});

app.get('/users/:id/show', function* () {
  yield this.render('show', { name: 'trek' });
});

app.run();

// rt.end();

//app.listen(3000);

/*
describe('Engine', () => {

});
*/
