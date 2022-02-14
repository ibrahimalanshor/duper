const { body, param } = require('express-validator')
const { validator } = require('../../../helpers')
const { checkTeamUniqueByName } = require('../validator')

const params = [
  param('id')
    .exists()
    .withMessage('ID Required')
    .bail()
    .isMongoId()
    .withMessage('ID Must Be MongoID'),
]

const rules = [
  body('name')
    .exists()
    .withMessage('Name Required')
    .bail()
    .notEmpty()
    .withMessage('Name Required')
    .bail()
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('Name Must Be String')
    .bail()
    .custom((val, { req }) =>
      checkTeamUniqueByName(val, {
        unique: true,
        uniqueId: req.params.id,
      })
    ),
]

module.exports = [
  [params, validator],
  [rules, validator],
]
