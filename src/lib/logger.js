/*!
 * trek - lib/logger
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import chalk from 'chalk';
import winston from 'winston';

let [Logger, Console] = [winston.Logger, winston.transports.Console];

// Expose a Logger instance.
export default new Logger({
  transports: [
    new Console({
      label: chalk.green('Trek'),
      prettyPrint: true,
      colorize: true,
      level: Trek.isProduction ? 'info' : 'debug'
    })
  ]
});
