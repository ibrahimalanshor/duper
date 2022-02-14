const { Router } = require('express')
const router = Router()

const { auth } = require('../../middlewares')
const projectMiddleware = require('./project.middleware')

auth.leader = projectMiddleware.leader
auth.team = projectMiddleware.team
auth.worker = projectMiddleware.worker

const ProjectController = require('./project.controller')
const ProjectRequest = require('./request')

const DocumentController = require('./document.controller')
const DocumentRequest = require('./request/document')

const BoardController = require('./board.controller')
const BoardRequest = require('./request/board')

const TaskController = require('./task.controller')
const TaskRequest = require('./request/task')

router
  .route('/')
  .get(auth.default, ProjectController.get)
  .post(auth.admin, ProjectRequest.store, ProjectController.store)

router
  .route('/:id')
  .get(auth.default, ProjectRequest.show, ProjectController.show)
  .put(auth.admin, ProjectRequest.update, ProjectController.update)
  .delete(auth.admin, ProjectRequest.delete, ProjectController.delete)

router
  .route('/:id/status')
  .patch(
    auth.default,
    auth.leader,
    ProjectRequest.updateStatus,
    ProjectController.updateStatus
  )

router
  .route('/:id/docs')
  .post(
    auth.default,
    auth.team,
    DocumentRequest.store,
    DocumentController.store
  )

router
  .route('/:id/docs/:document_id')
  .put(
    auth.default,
    auth.team,
    DocumentRequest.update,
    DocumentController.update
  )
  .delete(
    auth.default,
    auth.team,
    DocumentRequest.delete,
    DocumentController.delete
  )

router
  .route('/:id/boards')
  .post(auth.default, auth.leader, BoardRequest.store, BoardController.store)

router
  .route('/:id/boards/:board_id')
  .get(auth.default, BoardController.show)
  .put(auth.default, auth.leader, BoardRequest.update, BoardController.update)
  .delete(
    auth.default,
    auth.leader,
    BoardRequest.delete,
    BoardController.delete
  )

router
  .route('/:id/boards/:board_id/status')
  .patch(
    auth.default,
    auth.leader,
    BoardRequest.updateStatus,
    BoardController.updateStatus
  )

router
  .route('/:id/boards/:board_id/tasks')
  .post(auth.default, auth.leader, TaskRequest.store, TaskController.store)

router
  .route('/:id/boards/:board_id/tasks/:task_id')
  .put(auth.default, auth.leader, TaskRequest.update, TaskController.update)
  .delete(auth.default, auth.leader, TaskRequest.delete, TaskController.delete)

router
  .route('/:id/boards/:board_id/tasks/:task_id/status')
  .patch(
    auth.default,
    auth.worker,
    TaskRequest.updateStatus,
    TaskController.updateStatus
  )

router
  .route('/:id/boards/:board_id/tasks/:task_id/worker')
  .patch(
    auth.default,
    auth.leader,
    TaskRequest.updateWorker,
    TaskController.updateWorker
  )

module.exports = {
  path: '/projects',
  router,
}
