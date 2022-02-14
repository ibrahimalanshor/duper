const { body } = require('express-validator')
const { validator } = require('../../../../helpers')
const { checkBoardUniqueByName } = require('../../validator/board')

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
      checkBoardUniqueByName(val, { project_id: req.params.id })
    ),
  body('description')
    .optional()
    .notEmpty()
    .withMessage('Description Required')
    .bail()
    .isString()
    .withMessage('Description Must Be String')
    .bail(),
  body('label')
    .optional()
    .notEmpty()
    .withMessage('Label Required')
    .bail()
    .isString()
    .withMessage('Label Must Be String')
    .bail(),
]

module.exports = [rules, validator]
