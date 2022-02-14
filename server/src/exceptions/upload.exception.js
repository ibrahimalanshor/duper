const HttpException = require('./http.exception')

class UploadException extends HttpException {
  constructor(msg) {
    super(msg, 415)
  }
}

module.exports = UploadException
