import Trek from '../../';

var app = new Trek;

app.get('/', function* (next) {
  /*
  var info = yield this.sendMail({
    from: 'fundon cfddream@gmail.com',
    to: 'dockerboard dockerboard@gmail.com',
    subject: 'Hello Trek.js',
    text: 'Welcome!'
  });
  //console.log(info);
  */
  this.body = yield this.render('index', Trek.package);
});

app.run(3000);