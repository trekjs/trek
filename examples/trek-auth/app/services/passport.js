import url from 'url';
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

  passport.protocols = {
    local: ( ) => {
    },

    oauth: (req, token, tokenSecret, profile, next) => {
      let query = {
        identifier : profile.id,
        protocol   : 'oauth',
        tokens     : { token: token },
        profile    : profile
      };
      if (tokenSecret) {
        query.tokens.tokenSecret = tokenSecret;
      }
      passport.connect(req, query, profile, next);
    },


    oauth2: (req, accessToken, refreshToken, profile, next) => {
      let query = {
        identifier: profile.id,
        protocol   : 'oauth2',
        tokens     : { accessToken: accessToken },
        profile    : profile
      };
      if (refreshToken) {
        query.tokens.refreshToken = refreshToken;
      }
      passport.connect(req, query, profile, next);
    },

    openid: (req, identifier, profile, next) => {
      let query = {
        identifier: identifier,
        protocol   : 'openid',
        profile    : profile
      };
      passport.connect(req, query, profile, next);
    },
  };

  Object.defineProperty(passport, 'loadStrategies', {
    value: function() {
      Object.keys(this.strategies).forEach((key) => {
        let options = this.strategies[key].initialize;
        let filter = this.strategies[key].filter;
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
            _.defaults(options, defaultOptions, { usernameField: 'identifier' });
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
                        done(null, user);
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
            let protocol = this.strategies[key].protocol;
            let baseUrl = config.get('site.protocol') + config.get('site.host') + ':' + config.get('site.port');
            switch (protocol) {
              case 'oauth':
              case 'oauth2':
                options.callbackURL = url.resolve(baseUrl, options.callbackURL);
                break;

              case 'openid':
                options.returnURL = url.resolve(baseUrl, callback);
                options.realm     = baseUrl;
                options.profile   = true;
            }
            this.use(new Strategy(
              options,
              filter ? (...args) => {
                args = filter(...args);
                this.protocols[protocol](...args)
              } : this.protocols[protocol]
            ));
          }
        } catch (e) {
          app.logger.error(chalk.bold.red(`Missing passport-${stuffix} Strategy. ERROR: ${e.stack}.`));
        }
      });
    }
  });

  Object.defineProperty(passport, 'connect', {
    value: function connect(req, query, profile, done) {
      console.dir(query)
      let user = Object.create(null);
      let provider;

      query.provider = req.ctx.params.provider;

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
          //if (this.isAuthenticated() || ctx.method === 'GET') return this.redirect('/');
          if (action === 'register') {
            //https://github.com/sequelize/sequelize/blob/6a0912ad82915fd7bf20bd71ad7707abd473a137/test/integration/instance.validations.test.js#L917
            let o = _.pick(this.request.body, 'password', 'username', 'email');
            let result = UserModel.validate(o);
            if (result.error) return result;
            o = result.value;
            let salt = yield UserModel.salt();
            let password_hash = yield UserModel.hash(o.password, salt);
            let user = yield UserModel.build({
              username: o.username,
              email: o.email,
              salt: salt,
              password_hash: password_hash
            }).save();
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
            if (user && yield UserModel.verify(user.password_hash, o.password, user.salt)) {
              return {
                user: user
              };
            } else {
              ctx.flash('error', 'Password or identifier wrong.');
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
    UserModel.find({
      where: {
        id: id
      },
    }).done((err, user) => {
      user = user.toJSON();
      // Ignores password, password_hash, salt fileds into the session.
      delete user.password_hash;
      delete user.salt;
      done(err, user);
    });
  });

  passport.loadStrategies();
  return passport;
};