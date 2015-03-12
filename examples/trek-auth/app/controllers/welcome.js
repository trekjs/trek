function* index() {
  if (!this.session.user) {
    this.session.user = 'spock';
  }
  this.body = `Star Trek!\n
  ${this.state._csrf}`;
  this.body += '\n\nWelcome 2015.';
}

function* about() {
  this.body = 'About Trek!';
}

export { index, about };