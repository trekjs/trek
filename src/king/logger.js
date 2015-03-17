import chalk from 'chalk';
import winston from 'winston';

var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)({
      label: chalk.green('Trek'),
      prettyPrint: true,
      colorize: true,
      level: Trek.env === 'production' ? 'info' : 'debug'
        //timestamp: true
    })
  ]
});

export default logger;