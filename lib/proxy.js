export default function proxy (target, origin) {

  return new Proxy(target, {

    get (target, key, receiver) {
      return Reflect.has(target, key) ? Reflect.get(target, key, receiver) : Reflect.get(origin, key, receiver)
    },

    set (target, key, receiver) {
      return Reflect.has(target, key) ? Reflect.set(target, key, receiver) : Reflect.set(origin, key, receiver)
    }

  })

}
