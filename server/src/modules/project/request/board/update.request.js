const { body, param } = require('express-validator')
const { validator } = require('../../../../helpers')
const { checkBoardUniqueByName } = require('../../validator/board')

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
      checkBoardUniqueByName(val, {
        project_id: req.params.id,
        unique: true,
        uniqueId: req.params.board_id,
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
    .withMessage('Label Required')
    .bail()
    .isString()
    .withMessage('Label Must Be String')
    .bail(),
]

module.exports = [
  [params, validator],
  [rules, validator],
]
