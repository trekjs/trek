
export default {

  * index(next) {
    this.body = 'photos#index';
  },

  * create(next) {
    this.body = 'photos#create'
  },

  * ['new'](next) {
    this.body = 'photos#new';
  },

  * show(next) {
    this.body = 'photos#show';
  },

  * update(next) {
    this.body = 'photos#update';
  },

  * destroy(next) {
    this.body = 'photos#destroy';
  }

};
