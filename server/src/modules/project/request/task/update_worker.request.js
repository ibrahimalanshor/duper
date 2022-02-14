const { body, param } = require('express-validator')
const { validator } = require('../../../../helpers')
const { checkWorkerInTeamProject } = require('../../validator')

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
  body('worker')
    .exists()
    .withMessage('Worker Required')
    .bail()
    .isMongoId()
    .withMessage('Worker Must Be MongoID')
    .bail()
    .custom((val, { req }) => checkWorkerInTeamProject(val, req.params.id)),
]

module.exports = [
  [params, validator],
  [rules, validator],
]
