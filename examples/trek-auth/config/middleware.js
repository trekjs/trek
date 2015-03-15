import path from 'path';
import klm from 'koa-load-middlewares';

export default (app) => {
  let [config, ms, isProduction]
    = [app.config, klm(), app.env === 'production'];

  return [

    {
      handler: ms.morgan.middleware,
      options: [
        config.get('morgan.mode') || 'dev',
        config.get('morgan.stream')
          ? {
              stream: fs.createWriteStream(config.paths.get('log').first, {
                flags: 'a'
              })
            } : null
      ]
    },

    {
      handler: ms.favicon,
      options: path.join(config.publicPath, 'favicon.ico')
    },

    {
      handler: ms.staticCache,
      options: config.publicPath
    },

    {
      handler: ms.lusca,
      options: config.get('lusca')
    },

    {
      handler: ms.locale,
      options: app,
      isWrapped: true
    },

    {
      handler: ms.i18n,
      options: [ app, config.get('i18n') ]
    },

    {
      handler: ms.genericSession,
      options: config.session
    },

    {
      handler: () => {
        let passport = ms.passport;
        app.use(passport.initialize());
        app.use(passport.session());
        app.cache.set('passport', passport);
      },
      isWrapped: true
    },

    {
      handler: ms.connectFlash
    },

    {
      handler: ms.swig,
      options: [app, config.get('views')],
      isWrapped: true
    }
  ];

};