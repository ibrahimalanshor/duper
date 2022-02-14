const jwt = require('jsonwebtoken')
const { password } = require('../../../helpers')
const EmployeeModel = require('../../employee/model')
const { ValidationException } = require('../../../exceptions')
const { app_key } = require('../../../../config')

class AuthController {
  async login(req, res, next) {
    try {
      const credentials = await EmployeeModel.findOne({
        email: req.body.email,
        status: true,
      }).select('+password')
      const match = await password.check(
        req.body.password,
        credentials.password
      )

      if (!match)
        throw new ValidationException({
          password: { msg: 'Password Incorrect' },
        })

      const token = await jwt.sign(
        {
          user: {
            _id: credentials._id,
            name: credentials.name,
            email: credentials.email,
            phone: credentials.phone,
            address: credentials.address,
            gender: credentials.gender,
            position: credentials.position,
          },
          role: 'employee',
          expiresIn: '1h',
        },
        app_key,
        { expiresIn: '1h' }
      )

      return res.status(200).json(token)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new AuthController()
