export default {

  "development": {
    "username": "trek",
    "password": "star trek",
    "database": "trek",
    "host": "192.168.59.103",
    "port": "5432",
    "dialect": "postgres",
    "native": true,
    "timezone": "+00:00",

    "query"     : {
      "pool"    : true,
      "debug"   : true
    },

    "define": {
      "timestamps"  : true,
      "underscored" : true,
      "charset"     : "utf8"
    },
    "logging": true
  },

  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },

  "production": {
    "username": `${process.env.DATABASE_USERNAME}`,
    "password": `${process.env.DATABASE_PASSWORD}`,
    "database": `${process.env.DATABASE_DATABASE}`,
    "host":     `${process.env.DATABASE_HOST}`,
    "port":     `${process.env.DATABASE_PORT}`,
    "dialect": "postgres"
  }

};