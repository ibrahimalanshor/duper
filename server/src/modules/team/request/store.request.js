const { body } = require('express-validator')
const { validator } = require('../../../helpers')
const { checkTeamUniqueByName } = require('../validator')

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
    .custom(val => checkTeamUniqueByName(val)),
]

module.exports = [rules, validator]
