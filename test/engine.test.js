import rt from 'require-times';
import '../src/Trek';
import Engine from '../src/Engine';

// rt = rt()
// rt.start();

var app = new Engine(__dirname + '/fixtures');

var publicPath = app.paths.get('public', true); // absolute path

app.static(publicPath);

app.serveFile('/main.js', publicPath + '/js/main.js');

app.index(publicPath + '/index.html');

app.get('/users/:id', function* () {
  this.body = this.params;
});

app.get('/users/:ID/photos/:pid', function* () {
  this.body = this.params;
});

app.run();

// rt.end();

//app.listen(3000);

/*
describe('Engine', () => {

});
*/
