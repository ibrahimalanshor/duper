const { body, param } = require('express-validator')
const { validator } = require('../../../helpers')

const params = [
  param('id')
    .exists()
    .withMessage('ID required')
    .bail()
    .isMongoId()
    .withMessage('ID Must Be MongoID')
    .bail(),
]

module.exports = [params, validator]
