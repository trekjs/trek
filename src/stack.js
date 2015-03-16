/*!
 * trek/stack
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

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
      name: 'logger',
      handler: isProduction ? null : ms.logger,
      //disable: config.get('middleware.morgan.disable')
    },

    morgan: {
      name: 'morgan',
      handler: ms.morgan.middleware,
      options: [
        config.get('middleware.morgan.mode') || 'dev',
        config.get('middleware.morgan.stream') ? {
          stream: fs.createWriteStream(config.paths.get('log').first, {
            flags: 'a'
          })
        } : null
      ],
    },

    responseTime: {
      name: 'responseTime',
      handler: ms.responseTime,
    },

    xRequestId: {
      name: 'xRequestId',
      handler: ms.xRequestId,
      options: [undefined, true, true],
    },

    staticCache: {
      name: 'staticCache',
      handler: ms.staticCache,
      options: [config.publicPath, config.get('static')],
    },

    methodoverride: {
      name: 'methodoverride',
      handler: ms.methodoverride,
      options: config.get('methodoverride'),
    },

    qs: {
      name: 'qs',
      handler: ms.qs,
      options: app,
      isWrapped: true,
    },

    bodyparser: {
      name: 'bodyparser',
      handler: ms.bodyparser,
    },

    compress: {
      name: 'compress',
      handler: ms.compress,
      options: config.get('compress'),
    },

    conditionalGet: {
      name: 'conditionalGet',
      handler: ms.conditionalGet,
    },

    etag: {
      name: 'etag',
      handler: ms.etag,
    },

    genericSession: {
      name: 'genericSession',
      handler: ms.genericSession,
      options: config.session,
    },

    router: {
      name: 'router',
      handler: ms.router,
      options: app,
    }

  };

  stack = _.sortBy(_.merge(stackTemp, defaultStack, stack), 'priority');

  stack.forEach((m) => {
    let {
      name, handler, options, isWrapped, disabled
    } = m;
    if (!disabled && _.isFunction(handler)) {
      options = Array.isArray(options) ? options : [options];
      if (isWrapped) {
        handler.apply(undefined, options);
      } else {
        app.use(handler.apply(undefined, options));
      }
      app.logger.debug(`middleware:${name} is enabled.`)
    }
  });
};