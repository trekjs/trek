import proxyaddr from 'proxy-addr'

/**
 * Compile "proxy trust" value to function.
 *
 * @param  {Boolean|String|Number|Array|Function} val
 * @return {Function}
 * @api private
 */

export function compileTrust (val) {
  if ('function' === typeof val) return val

  if (true === val) {
    // Support plain true/false
    return () => true
  }

  if ('number' === typeof val) {
    // Support trusting hop count
    return (a, i) => i < val
  }

  if ('string' === typeof val) {
    // Support comma-separated values
    val = val.split(/ *, */)
  }

  return proxyaddr.compile(val || [])
}
