const { body, param } = require('express-validator')
const { validator } = require('../../../helpers')

const params = [
  param('id')
    .exists()
    .withMessage('ID Required')
    .bail()
    .isMongoId()
    .withMessage('ID Must Be MongoID'),
]

const rules = [
  body('status')
    .exists()
    .withMessage('Status Required')
    .bail()
    .isBoolean()
    .withMessage('Status Required')
    .bail(),
]

module.exports = [
  [params, validator],
  [rules, validator],
]
