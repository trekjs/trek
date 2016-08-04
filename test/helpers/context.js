import Stream from 'stream'
import Trek from '../../lib/trek'
import Context from '../../lib/context'

const createContext = (req, res, app = new Trek()) => {
  const socket = new Stream.Duplex()
  req = Object.assign({ headers: {}, socket }, Stream.Readable.prototype, req)
  res = Object.assign({ _headers: {}, socket }, Stream.Writable.prototype, res)
  req.socket.remoteAddress = req.socket.remoteAddress || '127.0.0.1'
  res.getHeader = k => res._headers[k.toLowerCase()]
  res.setHeader = (k, v) => {
    res._headers[k.toLowerCase()] = v
  }
  res.removeHeader = k => delete res._headers[k.toLowerCase()]
  return new Context(app, req, res)
}

export default createContext

export const request = (req, res, app) => createContext(req, res, app).req

export const response = (req, res, app) => createContext(req, res, app).res
