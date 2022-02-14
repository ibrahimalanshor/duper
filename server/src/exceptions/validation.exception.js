const HttpException = require('./http.exception')

class ValidationException extends HttpException {
  constructor(errors) {
    super('Validation Error', 422, errors)
  }
}

module.exports = ValidationException
