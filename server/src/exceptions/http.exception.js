class HttpException extends Error {
  constructor(msg = 'Server Error', status = 500, errors) {
    super(msg)

    this.status = status
    this.errors = errors
  }
}

module.exports = HttpException
