
export default (app) => {
  return {
    index: function* (next) {
      let db = this.app.getService('db');
      let salt = yield db.User.salt();
      let hash = yield db.User.hash('password', salt);
      this.logger.log('info', 'salt: %s, password: %s', salt, hash)
      this.body = 'users controller';
      this.body += `\nsalt: ${salt}\n`;
      this.body += `\nhash: ${hash}\n`;
      let confirm_password = yield db.User.verify(hash, '233', salt);
      this.body += `\n${confirm_password}\n`;
      let confirm_password1 = yield db.User.verify(hash, 'password', salt);
      this.body += `\n${confirm_password1}\n`;
      //this.body += `\n${User.hash('passowrd', salt)}`;
    }
  }
};