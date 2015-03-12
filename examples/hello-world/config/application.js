export default (config) => {
  config.set('views', {
    root: config.viewsPath
  }, true);

  config.set('i18n', {
    directory: config.paths.get('config/locales').path,
    locales: ['en', 'zh-CN', 'zh-tw'],
    modes: ['query', 'cookie', 'header']
  }, true);

  config.set('passport', {
    local: {
      initialize: {
        // by default, local strategy uses username and password, we will override with email
        //usernameField: 'username',
        //passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      authenticate: {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      }
    },
    bearer: {},
    twitter: {
      protocol: 'oauth',
      initialize: {
        consumerKey: 'uunwJOovU6ISXROBrxNsB8W57',
        consumerSecret: 'RuGeKvqca64nFzNE8IsQhzc2wwpvIizCkJHPnaX2sGi5iOuOzL',
        callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
      },
      authenticate: {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      }
    },
    github: {
      //protocol: '',
      initialize: {
        clientID: '248632fe936bccbebaaa',
        clientSecret: 'f53d28c7a6ff3f319ba513844cb9a38c793dae49',
        callbackURL: '/auth/github/callback'
      },
      authenticate: {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      }
    },
    digitalocean: {
      initialize: {
        clientID: 'db1dab6221dffad5d2501497df8f8c162644557299d04ff876bf9056eee1f365',
        clientSecret: '26f4dbb117cbd36a891690521f91dfbaacdce928715dab71b0cb6744a5e661a7',
        userProfileURL: 'https://api.digitalocean.com/v2/account',
        callbackURL: '/auth/digitalocean/callback'
      },
      authenticate: {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      }
    },
    bitbucket: {
      initialize: {
        consumerKey: 'MWM9WWQzMmSVFCGbrV',
        consumerSecret: 'sKsvWWuDjXwDkEbsKAgRQFqjHFL7zYEK',
        callbackURL: '/auth/bitbucket/callback'
      },
      authenticate: {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      }
    }
  });
};