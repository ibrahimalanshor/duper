const { validationResult } = require('express-validator')
const { ValidationException } = require('../exceptions')

module.exports = (req, res, next) => {
  try {
    validationResult(req).throw()

    next()
  } catch (err) {
    next(new ValidationException(err.mapped()))
  }
}
