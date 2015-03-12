import { pbkdf2, randomBytes } from 'mz/crypto';
import Joi from 'joi';

export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {

    username: {
      type: DataTypes.STRING(30),
      unique: true,
      allowNull: false,
      validate: {
        //is: /^\w[\w-]{0,29}$/,
        // https://github.com/regexps/regex-username
        is: /^\w[\w-]+$/,
        notEmpty: true,
        len: [3, 30]
      }
    },

    email: {
      type: DataTypes.STRING(256),
      unique: true,
      allowNull: false,
      validate: {
        // https://github.com/regexps/regex-email
        is: /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/,
        isEmail: true,
        isLowercase: true,
        notEmpty: true,
        len: [5, 256]
      }
    },

    password_hash: {
      type: DataTypes.STRING(64),
      allowNull: false
    },

    salt: {
      type: DataTypes.STRING(32),
      allowNull: false
    },

    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },

    avatar_url: {
      type: DataTypes.STRING,
      //allowNull: false
    },

    last_seen_at: { type: DataTypes.DATE },

    active: { type: DataTypes.BOOLEAN },

    name: { type: DataTypes.STRING },

    // biography
    bio: { type: DataTypes.TEXT },

    // md5(trim(email)), http://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50
    gravatar_id: { type: DataTypes.STRING },

    website: { type: DataTypes.STRING },

    location: { type: DataTypes.STRING },

    company: { type: DataTypes.STRING }

  }, {
    tableName: 'users',
    classMethods: {
      associate(models) {
        User.hasMany(models.Passport);
      },

      salt() {
        // sail: 32
        return randomBytes(16).then((buf) => {
          return buf.toString('hex');
        });
      },

      // password_hash: 64
      hash(password, salt) {
        // test: 10
        return pbkdf2(password, salt, 64000, 32, 'sha256').then((buf) => {
          return buf.toString('hex');
        });
      },

      //verify(hash, password, salt, 64000, 32, 'sha256') {
      verify(hash, password, salt) {
        return pbkdf2(password, salt, 64000, 32, 'sha256').then((buf) => {
          return hash === buf.toString('hex');
        });
      },

      get registerSchema() {
        return this._schema || (this._schema = {
          username: Joi.string().regex(/^\w[\w-]+$/).min(3).max(30).required(),
          //email: Joi.string().regex(/^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/).email({minDomainAtoms: 1}).min(5).max(256).required(),
          email: Joi.string().email({ minDomainAtoms: 2 }).min(5).max(256).required(),
          password: Joi.string().min(8).max(200).required()
        });
      },

      validate(object, done) {
        return Joi.validate(object, User.registerSchema, done);
      }
    },
    instanceMethods: {
    }
  });

  return User;
};