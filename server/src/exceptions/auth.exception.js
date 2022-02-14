const HttpException = require('./http.exception')

class AuthException extends HttpException {
  constructor(msg) {
    super(msg, 401)
  }
}

module.exports = AuthException
