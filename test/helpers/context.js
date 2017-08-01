import Stream from 'stream'
import { Context } from 'trek-engine'
import Trek from '../../lib/trek'

const createContext = async (req, res, app = new Trek()) => {
  const socket = new Stream.Duplex()
  req = Object.assign({ headers: {}, socket }, Stream.Readable.prototype, req)
  res = Object.assign({ _headers: {}, socket }, Stream.Writable.prototype, res)
  req.socket.remoteAddress = req.socket.remoteAddress || '127.0.0.1'
  res.getHeader = k => res._headers[k.toLowerCase()]
  res.setHeader = (k, v) => {
    res._headers[k.toLowerCase()] = v
  }
  res.removeHeader = k => delete res._headers[k.toLowerCase()]

  await app.bootUp(false)

  return new Context(app, req, res)
}

export default createContext

export const request = async (req, res, app) =>
  (await createContext(req, res, app)).req

export const response = async (req, res, app) =>
  (await createContext(req, res, app)).res

export const listen = app => {
  return new Promise((resolve, reject) => {
    app.run(function(err) {
      if (err) {
        return reject(err)
      }

      const { port } = this.address()
      resolve(`http://localhost:${port}`)
    })
  })
}
