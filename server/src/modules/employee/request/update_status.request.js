const { param, body } = require('express-validator')
const { validator } = require('../../../helpers')

const params = [
  param('id')
    .exists()
    .withMessage('ID Required')
    .bail()
    .isMongoId()
    .withMessage('ID Must Mongo ID')
    .bail(),
]

const rules = [
  body('status')
    .exists()
    .withMessage('Status Required')
    .bail()
    .isBoolean()
    .withMessage('Status Must Be Boolean'),
]

module.exports = [
  [params, validator],
  [rules, validator],
]
