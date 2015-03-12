import fs from 'mz/fs';
import path from 'path';
import chalk from 'chalk';
import co from 'co';
import glob from 'glob';
import Sequelize from 'sequelize';

export default (app, config) => {
  let env           = app.env;
  let dbConfigPath  = config.paths.get('config/database').path;
  let dbConfig      = require(dbConfigPath)[env];
  if (dbConfig.logging) dbConfig.logging = app.logger.info;
  let sequelize     = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
  let modelsPath    = config.paths.get('app/models').path;
  const db = Object.create(null);

  db.promise = co(function* () {
      let files = yield fs.readdir(modelsPath)
      files
        .filter((file) => {
          return (file.indexOf(".") !== 0);
        })
        .forEach((file) => {
          try {
            let model = sequelize.import(path.join(modelsPath, file));
            db[model.name] = model;
            app.logger.info(`* Trek modes - ${model.name}`)
          } catch(e) {
            app.logger.error(chalk.bold.red(e.stack));
          }
        });

      Object.keys(db).forEach((modelName) => {
        if ("associate" in db[modelName]) {
          db[modelName].associate(db);
        }
      });

      db.sequelize = sequelize;
      db.Sequelize = Sequelize;

      return yield sequelize.sync({ force: env !== 'production' });
    })

  return db;
};
