const { Router } = require('express')
const router = Router()

const { auth } = require('../../middlewares')

const AdminController = require('./admin.controller')
const AdminRequest = require('./request')

router
  .route('/')
  .get(auth.admin, AdminController.get)
  .post(auth.admin, AdminRequest.store, AdminController.store)
router
  .route('/:id')
  .put(auth.admin, AdminRequest.update, AdminController.update)
  .delete(auth.admin, AdminRequest.delete, AdminController.delete)

module.exports = {
  path: '/admins',
  router,
}
