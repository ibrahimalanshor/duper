const { body, param } = require('express-validator')
const { validator } = require('../../../helpers')
const {
  checkClientUniqueByName,
  checkClientUniqueByEmail,
} = require('../validator')

const params = [
  param('id')
    .exists()
    .withMessage('ID required')
    .bail()
    .isMongoId()
    .withMessage('ID Must Be MongoID')
    .bail(),
]

const rules = [
  body('status')
    .exists()
    .withMessage('Status Required')
    .isBoolean()
    .withMessage('Status Must Be Boolean')
    .bail(),
]

module.exports = [
  [params, validator],
  [rules, validator],
]
