const { NotFoundException } = require('../exceptions')

module.exports = (cond, msg, cb = null) => {
  if (cond) {
    if (cb) cb()

    throw new NotFoundException(msg)
  }
}
