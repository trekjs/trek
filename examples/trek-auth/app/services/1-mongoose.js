import chalk from 'chalk';
import co from 'co';
import glob from 'glob';
import thenify from 'thenify';

export default (app, config) => {
  return;
  import mongoose from 'mongoose';
  let env           = app.env;
  let dbConfigPath  = config.paths.get('config/database').path;
  let dbConfig      = require(dbConfigPath)[env];

  mongoose.connect('mongodb://localhost/test');
  let db = mongoose.connection;
  db.on('error', app.logger.error(chalk.bold.red('connection error:')));
  db.once('open', function (callback) {
    app.logger.info(chalk.green('* Trek mongoose connected.'))
  });

  return mongoose;
};
