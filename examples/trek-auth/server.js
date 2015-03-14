import Trek from '../../src/trek';

var app = new Trek;

app.get('/', function* (next) {
  this.state.currentUser = this.user;
  this.body = yield this.render('index');
  this.body += this.i18n.__('locales.en');
  this.body += `\nIs Authenticated ${this.isAuthenticated()}
<br/> userid: ${this.user && this.user.id} <br/> ${JSON.stringify(this.req.user)}.\n`;
});

var authCtrl = require(app.paths.get('app/controllers').path + '/auth');

app.get('/login', authCtrl.login);
app.get('/logout', authCtrl.logout);
app.get('/signup', authCtrl.register);
app.post('/auth/local', authCtrl.callback);
app.post('/auth/local/:action', authCtrl.callback);
app.get('/auth/:provider', authCtrl.provider);
app.get('/auth/:provider/:action', authCtrl.callback);

app.on('error', (err, context) => {
  app.logger.error(err);
});

app.run();