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
  var token = this.jwt.sign({ name: 'trek' }, 'test');
  var payload = yield this.jwt.verify(token, 'test');
  console.log(payload);
  this.body = yield this.render('index', Trek.package);
  this.body += `\nIs Authenticated ${this.isAuthenticated()}.\n`;
  this.body += this.i18n.__('i18n');
});

app.run(3000);