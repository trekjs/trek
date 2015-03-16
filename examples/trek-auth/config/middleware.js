import path from 'path';
import klm from 'koa-load-middlewares';

export default (app) => {
  let [config, ms, isProduction] = [app.config, klm(), Trek.isProduction];

  return {

    favicon: {
      name: 'favicon',
      handler: ms.favicon,
      options: path.join(config.publicPath, 'favicon.ico'),
      priority: 235
    },

    locale: {
      name: 'locale',
      handler: ms.locale,
      options: app,
      isWrapped: true,
      priority: 240
    },

    i18n: {
      name: 'i18n',
      handler: ms.i18n,
      options: [app, config.get('i18n')],
      priority: 245
    },

    lusca: {
      name: 'lusca',
      handler: ms.lusca,
      options: config.get('lusca'),
      priority: 250
    },

    passport: {
      name: 'passport',
      handler: () => {
        let passport = ms.passport;
        app.use(passport.initialize());
        app.use(passport.session());
        app.cache.set('passport', passport);
      },
      isWrapped: true,
      priority: 255
    },

    connectFlash: {
      name: 'connectFlash',
      handler: ms.connectFlash,
      priority: 260
    },

    swig: {
      name: 'swig',
      handler: ms.swig,
      options: [app, config.get('views')],
      isWrapped: true,
      priority: 265
    },

    router: {
      name: 'router',
      //disabled: true
    }
  };

};