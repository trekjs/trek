
export default {

  * index(ctx, next) {
    return 'comments#index'
  },

  * create(ctx, next) {
    let name = 'trek'
    let age = 233
    return { name, age }
  },

  * ['new'](ctx, next) {
    ctx.body = 'comments#new'
  },

  * show(ctx, next) {
    ctx.body = 'comments#show'
  },

  * update(ctx, next) {
    ctx.body = 'comments#update'
  },

  * destroy(ctx, next) {
    ctx.body = 'comments#destroy'
  }

}
