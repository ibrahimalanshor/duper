const { body } = require('express-validator')
const { validator } = require('../../../../helpers')
const { checkTaskUniqueByName } = require('../../validator/task')

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
      checkTaskUniqueByName(val, {
        project_id: req.params.id,
        board_id: req.params.board_id,
      })
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
    .withMessage('Description Required')
    .bail()
    .isString()
    .withMessage('Description Must Be String')
    .bail(),
  body('estimate')
    .optional()
    .isISO8601()
    .withMessage('Estimate Must Be Date')
    .bail()
    .isAfter()
    .withMessage('Estimate Must Be After Now')
    .bail(),
]

module.exports = [rules, validator]
