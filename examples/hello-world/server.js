import Trek from '../../';

var app = new Trek;

app.get('/', function* (next) {
  this.body = yield this.render('index', Trek.package);
});

app.run(3000);