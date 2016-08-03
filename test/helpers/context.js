import Stream from 'stream'
import Context from '../../lib/context'

const createContext = (req, res) => {
  const socket = new Stream.Duplex()
  req = Object.assign({ headers: {}, socket }, Stream.Readable.prototype, req)
  res = Object.assign({ _headers: {}, socket }, Stream.Writable.prototype, res)
  req.socket.remoteAddress = req.socket.remoteAddress || '127.0.0.1'
  res.getHeader = k => res._headers[k.toLowerCase()]
  res.setHeader = (k, v) => {
    res._headers[k.toLowerCase()] = v
  }
  res.removeHeader = k => delete res._headers[k.toLowerCase()]
  return new Context(req, res)
}

export default createContext

export const request = (req, res) => createContext(req, res).req

export const response = (req, res) => createContext(req, res).res
