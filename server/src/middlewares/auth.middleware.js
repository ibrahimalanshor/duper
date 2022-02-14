const jwt = require('jsonwebtoken')
const { AuthException } = require('../exceptions')
const { app_key } = require('../../config')

module.exports = {
  default: async (req, res, next) => {
    try {
      const token = req.headers.authorization

      if (!token) throw 'Authorization Empty'

      const decoded = await jwt.verify(token, app_key)

      req.auth = decoded

      next()
    } catch (err) {
      next(new AuthException(err))
    }
  },
  admin: async (req, res, next) => {
    try {
      const token = req.headers.authorization

      if (!token) throw 'Authorization Empty'

      const decoded = await jwt.verify(token, app_key)

      if (decoded.role !== 'admin') throw "You're not admin"

      req.auth = decoded

      next()
    } catch (err) {
      next(new AuthException(err))
    }
  },
  employee: async (req, res, next) => {
    try {
      const token = req.headers.authorization

      if (!token) throw 'Authorization Empty'

      const decoded = await jwt.verify(token, app_key)

      if (decoded.role !== 'employee') throw "You're not employee"

      req.auth = decoded

      next()
    } catch (err) {
      next(new AuthException(err))
    }
  },
}
