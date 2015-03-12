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
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
};