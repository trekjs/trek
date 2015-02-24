class Trek {

  static get env() {
    return this._env ?= process.env.TREK_ENV || process.env.NODE_ENV || 'development';
  }

  static set env(environment) {
    return this._env = environment;
  }

  static get application() {
  }

}

// export Trek to Global
global.Trek = Trek;
export default Trek;
