import Trek from '../..';

var app = new Trek;

app.get('/', function* (next) {
  this.state.currentUser = this.user;
  this.body = yield this.render('index');
  this.body += this.i18n.__('locales.en');
  this.body += `\nIs Authenticated ${this.isAuthenticated()}
<br/> userid: ${this.user && this.user.id} <br/> ${JSON.stringify(this.req.user)}.\n`;
});

app.on('error', (err, context) => {
  app.logger.error(err);
});

app.run();
