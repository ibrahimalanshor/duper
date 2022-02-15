const { body, param } = require('express-validator')
const { validator } = require('../../../../helpers')
const { checkTaskUniqueByName } = require('../../validator/task')

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
  param('task_id')
    .exists()
    .withMessage('Task ID Required')
    .bail()
    .isMongoId()
    .withMessage('Task ID Must Be MongoID'),
]

const rules = [
  body('name')
    .exists()
    .withMessage('Name Required')
    .bail()
    .notEmpty()
    .withMessage('Name Required')
    .bail()
    .isAlphanumeric('en-US', { ignore: ' ' })
    .withMessage('Name Must Be String')
    .bail()
    .custom((val, { req }) =>
      checkTaskUniqueByName(val, {
        project_id: req.params.id,
        board_id: req.params.board_id,
        unique: true,
        uniqueId: req.params.task_id,
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

module.exports = [
  [params, validator],
  [rules, validator],
]
