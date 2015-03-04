import Trek from '../../';

var app = new Trek;

app.get('/', function* (next) {
  this.body = 'Hello World';
});

app.run(3000);