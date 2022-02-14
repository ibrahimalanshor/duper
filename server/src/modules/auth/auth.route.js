const { Router } = require('express')
const router = Router()

const AdminAuthController = require('./admin/auth.controller')
const AdminAuthRequest = require('./admin/request')

const EmployeeAuthController = require('./employee/auth.controller')
const EmployeeAuthRequest = require('./employee/request')

router.post('/admin', AdminAuthRequest.login, AdminAuthController.login)
router.post(
  '/employee',
  EmployeeAuthRequest.login,
  EmployeeAuthController.login
)

module.exports = {
  path: '/auth',
  router,
}
