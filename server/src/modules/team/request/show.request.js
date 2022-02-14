const { param } = require('express-validator')
const { validator } = require('../../../helpers')

const params = [
  param('id')
    .exists()
    .withMessage('ID Required')
    .bail()
    .isMongoId()
    .withMessage('ID Must Be MongoID'),
]

module.exports = [params, validator]
