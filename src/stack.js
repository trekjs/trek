/*!
 * trek/stack
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import _ from 'lodash-node';
import klm from 'koa-load-middlewares';
import defaultStack from './defaultStack';

export default (app) => {
  let isProduction = Trek.isProduction;
  let [config, ms, stack] = [app.config, klm(), []];
  let stackPath = config.paths.get('config/middleware').first;

  try {
    stack = require(stackPath)(app);
  } catch (e) {
    app.logger.error(`Loading ${chalk.red(stackPath)} failed ${e}`);
  }

  let stackTemp = {

    logger: {
      handler: isProduction ? null : ms.logger
      //disabled: true
    },

    morgan: {
      handler: ms.morgan.middleware,
      options: [
        config.get('morgan.mode') || 'tiny',
        config.get('morgan.stream') ? {
          stream: fs.createWriteStream(config.paths.get('log').first, {
            flags: 'a'
          })
        } : null
      ]
    },

    responseTime: {
      handler: ms.responseTime
    },

    xRequestId: {
      handler: ms.xRequestId,
      options: [app, {
        key: undefined,
        noHyphen: true,
        inject: true
      }]
    },

    staticCache: {
      handler: ms.staticCache,
      options: [config.publicPath, config.get('static')]
    },

    methodoverride: {
      handler: ms.methodoverride,
      options: config.get('methodoverride')
    },

    qs: {
      handler: ms.qs,
      options: app
    },

    bodyparser: {
      handler: ms.bodyparser
    },

    compress: {
      handler: ms.compress,
      options: config.get('compress')
    },

    conditionalGet: {
      handler: ms.conditionalGet
    },

    etag: {
      handler: ms.etag
    },

    genericSession: {
      handler: ms.genericSession,
      options: config.session
    },

    router: {
      handler: ms.router,
      options: app
    },

    //------//

    favicon: {
      handler: ms.favicon,
      options: path.join(config.publicPath, 'favicon.ico')
    },

    locale: {
      handler: ms.locale,
      options: app
    },

    i18n: {
      handler: ms.i18n,
      options: [app, config.get('i18n')]
    },

    lusca: {
      handler: ms.lusca,
      options: config.get('lusca')
    },

    passport: {
      name: 'passport',
      handler: () => {
        let passport = ms.passport;
        app.use(passport.initialize());
        app.use(passport.session());
        app.cache.set('passport', passport);
      }
    },

    connectFlash: {
      handler: ms.connectFlash
    },

    swig: {
      handler: ms.swig,
      options: [app, config.get('views')]
    }

  };

  stack = _.sortBy(
    _.map(_.merge(
      stackTemp, defaultStack, stack), (m, k) => {
      if (!m.name) {
        m.name = k;
      }
      return m;
    }),
    'priority'
  );

  stack.forEach((m) => {
    let {
      name, handler, options, isWrapped, disabled
    } = m;
    if (!disabled) {
      if (_.isFunction(handler)) {
        if (!options) {
          options = config.get(name);
        }
        options = Array.isArray(options) ? options : [options];
        if (isWrapped) {
          handler.apply(undefined, options);
        } else {
          app.use(handler.apply(undefined, options));
        }
      } else {
        app.logger.warn(`middleware:${name} is enabled.`);
      }
    }
  });
};
