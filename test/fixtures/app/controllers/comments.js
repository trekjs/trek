
export default {

  * index(next) {
    this.body = 'comments#index';
  },

  * create(next) {
    this.body = 'comments#create'
  },

  * ['new'](next) {
    this.body = 'comments#new';
  },

  * show(next) {
    this.body = 'comments#show';
  },

  * update(next) {
    this.body = 'comments#update';
  },

  * destroy(next) {
    this.body = 'comments#destroy';
  }

};
