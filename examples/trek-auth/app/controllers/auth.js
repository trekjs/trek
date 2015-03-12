
export default {

  login: function* () {
    if (this.isAuthenticated()) {
      return this.redirect('/');
    }
    yield this.render('auth/login', {
      errors: this.flash('error'),
      providers:this.config.get('passport.list')
    });
  },

  // singout
  logout: function* () {
    this.logout();
    this.redirect('/');
  },

  // signup
  register: function* () {
    yield this.render('auth/register', {
      errors: this.flash('error')
    });
  },

  provider: function* (next) {
    let provider = this.params.provider || 'local';
    // Ignore local and `GET` HTTP verb.
    if (this.method != 'post' && provider === 'local') return this.redirect('/login');
    let passport = this.app.getService('passport');
    yield passport.endpoint(this, provider);
    //yield next;
  },

  callback: function* (next) {
    let flashError = this.flash('error')[0];
    let provider = this.params.provider || 'local';
    let action = this.params.action || 'connect';
    let passport = this.app.getService('passport');
    let result = yield passport.callback(this, provider, action);
    if (result && !result.error && result.user) {
      yield this.login(result.user);
      return this.redirect('/');
    }
    if (result && result.error) {
      this.flash('error', result.error);
      switch(action) {
        case 'register':
          this.redirect('/signup')
          return;
        case 'disconnect':
          this.redirect('back')
          return;
        default:
          this.redirect('/login')
          return;
      }
    }
  },

  disconnect: function* () {

  }

};