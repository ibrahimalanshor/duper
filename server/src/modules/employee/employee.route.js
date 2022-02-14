const { Router } = require('express')
const router = Router()

const { auth } = require('../../middlewares')

const EmployeeController = require('./employee.controller')
const EmployeeRequest = require('./request')

router
  .route('/')
  .get(auth.default, EmployeeController.get)
  .post(auth.admin, EmployeeRequest.store, EmployeeController.store)
router
  .route('/:id')
  .put(auth.admin, EmployeeRequest.update, EmployeeController.update)
  .delete(auth.admin, EmployeeRequest.delete, EmployeeController.delete)
router
  .route('/:id/status')
  .patch(
    auth.admin,
    EmployeeRequest.updateStatus,
    EmployeeController.updateStatus
  )

module.exports = {
  path: '/employees',
  router,
}
