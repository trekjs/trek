
export default {

  * index(next) {
    return 'comments#index'
  },

  * create(next) {
    let name = 'trek'
    let age = 233
    return { name, age }
  },

  * ['new'](next) {
    this.body = 'comments#new'
  },

  * show(next) {
    this.body = 'comments#show'
  },

  * update(next) {
    this.body = 'comments#update'
  },

  * destroy(next) {
    this.body = 'comments#destroy'
  }

}
