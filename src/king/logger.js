/*!
 * trek - lib/king/logger
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

import chalk from 'chalk';
import winston from 'winston';

let [Logger, Console] = [winston.Logger, winston.transports.Console];
let logger = new Logger({
  transports: [
    new Console({
      label: chalk.green('Trek'),
      prettyPrint: true,
      colorize: true,
      level: Trek.env === 'production' ? 'info' : 'debug'
        //timestamp: true
    })
  ]
});

export default logger;
