import chalk from 'chalk';
import _ from 'lodash-node';

export default (app, config) => {
  let passport = app.cache.get('passport');
  let models = app.getService('sequelize');
  let PassportModel = models.Passport;
  let UserModel = models.User;

  Object.defineProperty(passport, 'strategies', {
    get: function() {
      return this._strategiesOptions || (this._strategiesOptions = (config.get('passport.strategies') || Object.create(null)));
    }
  });

  Object.defineProperty(passport, 'loadStrategies', {
    value: function() {
      Object.keys(this.strategies).forEach((key) => {
        let options = this.strategies[key].initialize;
        let defaultOptions = {
          passReqToCallback: true
        };
        let Strategy;
        let stuffix = key;
        if (key === 'bearer') stuffix = `http-${stuffix}`;
        try {
          Strategy = require(`passport-${stuffix}`).Strategy;
          if (key === 'local') {
            // Since we need to allow users to login using both usernames as well as
            // emails, we'll set the username field to something more generic.
            _.defaults(options, defaultOptions, {
              usernameField: 'identifier'
            });
            console.dir(options);
            this.use(new Strategy(
              options, (req, identifier, password, done) => {

                UserModel.find({
                    where: {
                      $or: {
                        username: identifier,
                        email: identifier
                      }
                    }
                  })
                  .then((user) => {
                    if (user) {
                      let verified = UserModel.verify(user.password_hash, password, user.salt);
                      if (verified) {
                        done(null, users);
                      } else {
                        req.flash('error', 'Password or identifier wrong.');
                      }
                    }
                  })
                  .catch((err) => {
                    app.logger.error(chalk.bold.red(err));
                  })
                  .finally((err, user) => {
                    if (!err) {
                      req.flash('error', 'Password or identifier wrong.');
                    }
                    done(err, user);
                  });
              }
            ));
          } else if (key === 'bearer') {
            this.use(new Strategy(
              options || {}, (token, done) => {
                Passport.find({
                    where: {
                      access_token: token
                    }
                  })
                  .then((p) => {
                    console.log(p);
                  });
              }
            ));
          } else {
            _.defaults(options, defaultOptions);
            this.use(new Strategy(
              options, (req, token, tokenSecret, done) => {}
            ));
          }
        } catch (e) {
          console.log(e.stack);
          app.logger.error(chalk.bold.red(`Missing passport-${stuffix} Strategy.`));
        }
      });
    }
  });

  Object.defineProperty(passport, 'connect', {
    value: function connect(ctx, query, profile) {
      let user = Object.create(null);
      let provider;

      query.provider = ctx.params.provider;

      provider = profile.provider || query.provider;

      if (!provider) {
        return
      }

      if (_.has(profile, 'emails')) {
        user.email = profile.emails[0].value;
      }

      if (_.has(profile, 'username')) {
        user.username = profile.username;
      }

      if (!user.email && !user.username) {
        return
      }
    }
  });

  Object.defineProperty(passport, 'endpoint', {
    value: function endpoint(ctx, provider = 'local') {
      if (!_.has(this.strategies, provider)) {
        return function* redirectToLogin() {
          return this.redirect('/login');
        };
      }
      let options = this.strategies[provider].authenticate || Object.create(null);
      return this.authenticate(provider, options);
    }
  });

  Object.defineProperty(passport, 'callback', {
    value: function callback(ctx, provider = 'local', action) {
      if (provider === 'local' && action) {
        return function* localCallback() {
          if (this.isAuthenticated() || ctx.method === 'get') return this.redirect('/');
          if (action === 'register') {
            let o = _.pick(this.request.body, 'password', 'username', 'email');
            let result = UserModel.validate(o);
            if (result.error) return result;
            o = result.value;
            let salt = yield UserModel.salt();
            let password_hash = yield UserModel.hash(o.password, salt);
            console.log(salt, password_hash)
            let user = yield UserModel.create({
              username: o.username,
              email: o.email,
              salt: salt,
              password_hash: password_hash
            });
            return {
              user: user
            };
          } else if (action === 'connect') {
            let o = _.pick(this.request.body, 'identifier', 'password');
            let user = yield UserModel.find({
              where: {
                $or: {
                  username: o.identifier,
                  email: o.identifier
                }
              }
            });
            if (user && UserModel.verify(user.password_hash, o.password, user.salt)) {
              return {
                user: user
              };
            } else {
              return null;
            }
          } else if (action === 'disconnect') {

          }
        };
      } else {
        if (action === 'disconnect' && ctx.req.user) {
          return this.disconnect();
        } else {
          let options = this.strategies[provider].authenticate || Object.create(null);
          return this.authenticate(provider, options);
        }
      }
    }
  });

  passport.serializeUser(function(user, done) {
    done(null, user.id || 0);
  });
  passport.deserializeUser(function(id, done) {
    let user = {
      id: id,
      username: 'test'
    };
    UserModel.find({
      where: {
        id: id
      },
      attributes: [
        'username',
        'email',
        'name',
        'last_seen_at',
        'active',
        'avatar_url',
        'admin'
      ]
    }).done(done);
  });

  passport.loadStrategies();
  return passport;
};