const { Router } = require('express')
const router = Router()

const { auth } = require('../../middlewares')

const ClientController = require('./client.controller')
const ClientRequest = require('./request')

router
  .route('/')
  .get(auth.default, ClientController.get)
  .post(auth.admin, ClientRequest.store, ClientController.store)

router
  .route('/:id')
  .put(auth.admin, ClientRequest.update, ClientController.update)
  .delete(auth.admin, ClientRequest.delete, ClientController.delete)

router
  .route('/:id/status')
  .patch(auth.admin, ClientRequest.updateStatus, ClientController.updateStatus)

module.exports = {
  path: '/clients',
  router,
}
