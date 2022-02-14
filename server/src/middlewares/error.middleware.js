const HttpException = require('../exceptions/http.exception')

module.exports = (err, req, res, next) => {
  if (err instanceof HttpException) {
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors,
    })
  } else {
    console.log(err)

    return res.status(500).json(err.message)
  }
}
