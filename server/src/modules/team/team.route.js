const { Router } = require('express')
const router = Router()

const { auth } = require('../../middlewares')
auth.leader = require('./team.middleware').leader

const TeamController = require('./team.controller')
const TeamRequest = require('./request')

router
  .route('/')
  .get(auth.default, TeamController.get)
  .post(auth.admin, TeamRequest.store, TeamController.store)

router
  .route('/:id')
  .get(auth.default, TeamRequest.show, TeamController.show)
  .put(auth.default, auth.leader, TeamRequest.update, TeamController.update)
  .delete(auth.admin, TeamController.delete)

router
  .route('/:id/status')
  .patch(auth.admin, TeamRequest.updateStatus, TeamController.updateStatus)

router
  .route('/:id/employees')
  .patch(
    auth.default,
    auth.leader,
    TeamRequest.addEmployees,
    TeamController.addEmployees
  )

router
  .route('/:id/employees/:employee_id')
  .delete(
    auth.default,
    auth.leader,
    TeamRequest.removeEmployees,
    TeamController.removeEmployees
  )

router.route('/:id/leader').patch(auth.admin, TeamController.updateLeader)

module.exports = {
  path: '/teams',
  router,
}
