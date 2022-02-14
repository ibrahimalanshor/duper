const { body, param } = require('express-validator')
const { validator } = require('../../../helpers')

const params = [
  param('id')
    .exists()
    .withMessage('ID Required')
    .bail()
    .isMongoId()
    .withMessage('ID Must Be MongoID')
    .bail(),
]

const rules = [
  body('status')
    .exists()
    .withMessage('Status Required')
    .bail()
    .isIn(['active', 'finish', 'failed'])
    .withMessage('Must be In active, finish, failed'),
]

module.exports = [
  [params, validator],
  [rules, validator],
]
