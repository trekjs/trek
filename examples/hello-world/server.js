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
  this.body = yield this.render('index', Trek.package);
  this.body += `\nIs Authenticated ${this.isAuthenticated()}.\n`;
  this.body += this.i18n.__('i18n');
  this.body += JSON.stringify(this.flash);
});

var usersCtrl = require(app.paths.get('app/controllers').path + '/users')(app);
app.get('/users', usersCtrl.index);

app.passport.serializeUser(function (user, done) {
  done(null, user.id);
});
app.passport.deserializeUser(function(id, done) {
  let user = {
    id: 233,
    username: 'test'
  };
  done(null, user)
});

var LocalStrategy = require('passport-local').Strategy
app.passport.use(new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
},function(req, username, password, done) {
  // retrieve user ...
  if (username === 'test' && password === 'test') {
    let user = {
      id: 233,
      username: 'test'
    };
    done(null, user)
  } else {
    done(null, false)
  }
}));

var JwtStrategy = require('passport-jwt').Strategy;
app.passport.use(new JwtStrategy({
  secretOrKey: 'secret',
  issuer: 'trekjs',
  audience: 'trekjs.com'
}, function (paylod, done) {
  console.log('jwt', paylod);
  done(null, paylod);
}));

// https://github.com/jaredhanson/passport-github/blob/master/examples/login/app.js
// https://github.com/rkusa/koa-passport-example/blob/master/auth.js
var GitHubStrategy = require('passport-github').Strategy
app.passport.use(new GitHubStrategy({
    clientID: '248632fe936bccbebaaa',
    clientSecret: 'f53d28c7a6ff3f319ba513844cb9a38c793dae49',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    process.nextTick(function() {
      done(null, profile)
    });
  }
))

app.post('/login', app.passport.authenticate('local', {
  successRedirect: '/app',
  failureRedirect: '/'
}));

app.post('/api', app.passport.authenticate('jwt', {
  successRedirect: '/app',
  failureRedirect: '/'
}));

app.get('/auth/github', app.passport.authenticate('github'));
app.get('/auth/github/callback', app.passport.authenticate('github', {
  //scope: 'email',
  successRedirect: '/app',
  failureRedirect: '/',
  failureFlash: true
}));

app.get('/app', function* () {
  this.body = this.isAuthenticated();
});

app.on('error', (err, context) => {
  app.logger.error(err);
});

var db = require('./app/services/sequelize')(app, app.config);

app.setService('db', db);

app.run(3000);