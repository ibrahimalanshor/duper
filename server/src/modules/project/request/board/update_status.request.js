const { body, param } = require('express-validator')
const { validator } = require('../../../../helpers')

const params = [
  param('id')
    .exists()
    .withMessage('ID Required')
    .bail()
    .isMongoId()
    .withMessage('ID Must Be MongoID'),
  param('board_id')
    .exists()
    .withMessage('Board ID Required')
    .bail()
    .isMongoId()
    .withMessage('Board ID Must Be MongoID'),
]

const rules = [
  body('status')
    .exists()
    .withMessage('Status Required')
    .bail()
    .isBoolean()
    .withMessage('Status Must Be Boolean')
    .bail(),
]

module.exports = [
  [params, validator],
  [rules, validator],
]
