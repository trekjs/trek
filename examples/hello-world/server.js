import Trek from '../../src/trek';

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
  this.flash('info', 'Flash is back!');
  this.body = yield this.render('index', Trek.package);
  this.body += `\nIs Authenticated ${this.isAuthenticated()} userid: ${this.user} ${JSON.stringify(this.req.user)}.\n`;
  this.body += this.i18n.__('i18n');
  this.body += JSON.stringify(this.flash());
});

var authCtrl = require(app.paths.get('app/controllers').path + '/auth');
app.get('/login', authCtrl.login);
app.get('/logout', authCtrl.logout);
app.get('/signup', authCtrl.register);
app.post('/auth/local', authCtrl.callback);
app.post('/auth/local/:action', authCtrl.callback);
app.get('/auth/:provider', authCtrl.provider);
app.get('/auth/:provider/:action', authCtrl.callback);

var usersCtrl = require(app.paths.get('app/controllers').path + '/users');
app.get('/users', usersCtrl.index);

// // Require authentication for now
// app.use(function* (next) {
//   if (this.isAuthenticated()) {
//     yield next;
//   } else {
//     this.redirect('/');
//   }
// });
//
/*
var passport = app.getService('passport');

app.get('/login')
app.post('/login', passport.authenticate('local', {
  successRedirect: '/app',
  failureRedirect: '/'
}));



var JwtStrategy = require('passport-jwt').Strategy;
passport.use(new JwtStrategy({
  secretOrKey: 'secret',
  issuer: 'trekjs',
  audience: 'trekjs.com'
}, function (paylod, done) {
  console.log('jwt', paylod);
  done(null, paylod);
}));

// https://github.com/jaredhanson/passport-github/blob/master/examples/login/app.js
// https://github.com/rkusa/koa-passport-example/blob/master/auth.js

app.post('/api', passport.authenticate('jwt', {
  successRedirect: '/app',
  failureRedirect: '/'
}));

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', {
  //scope: 'email',
  successRedirect: '/app',
  failureRedirect: '/',
  failureFlash: true
}));
*/

app.get('/app', function* () {
  this.body = this.isAuthenticated();
});

app.on('error', (err, context) => {
  app.logger.error(err);
});

app.run(3000);