# trek auth

A Passport.js-based authentication example for use with the Trek.

## Start up


### configs

* `config/database.js`
* `config/environments/development.js`


```bash
$ npm i -d
```

```bash
# In trek root.
$ DEBUG=* nodemon $(which babel-node) examples/trek-auth/server.js
```

Or

```bash
$ make trek-auth
```

## Requirements

* Passport
* Sequelize
* pg
* nodemon
* babel