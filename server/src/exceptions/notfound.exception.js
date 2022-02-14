const HttpException = require('./http.exception')

class NotFoundException extends HttpException {
  constructor(msg = 'Not Found') {
    super(msg, 404)
  }
}

module.exports = NotFoundException
