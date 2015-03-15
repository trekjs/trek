/*!
 * trek/stack
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import isFunction from 'lodash-node/modern/lang/isFunction';
import klm from 'koa-load-middlewares';

export default (app) => {
  let isProduction = app.env === 'production';
  let [config, ms, stack] = [app.config, klm(), []];
  let stackPath = config.paths.get('config/middleware').first;
  try {
    stack = require(stackPath)(app);
  } catch (e) {
    app.logger.error(`Loading ${chalk.red(stackPath)} failed ${e.code}`);
  }

  // default before stack
  let beforeStack = [
    {
      handler: isProduction ? null : ms.logger
    },

    {
      handler: ms.conditionalGet
    },

    {
      handler: ms.etag
    },

    {
      handler: ms.xRequestId,
      options: [undefined, true, true]
    },

    {
      handler: ms.responseTime
    },

    {
      handler: ms.methodoverride
    },

    {
      handler: ms.qs,
      options: app,
      isWrapped: true
    },

    {
      handler: ms.bodyparser
    },

  ];

  // default after stack
  let afterStack = [
    {
      handler: ms.router,
      options: app
    }
  ];

  stack = [].concat(beforeStack).concat(stack).concat(afterStack);

  stack.forEach((m) => {
    let { handler, options, isWrapped } = m;
    if (isFunction(handler)) {
      options = Array.isArray(options) ? options : [options];
      if (isWrapped) {
        handler.apply(undefined, options);
      } else {
        app.use(handler.apply(undefined, options));
      }
    }
  });
};