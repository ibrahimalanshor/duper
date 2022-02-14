const jwt = require('jsonwebtoken')
const { password } = require('../../../helpers')
const AdminModel = require('../../admin/model')
const { ValidationException } = require('../../../exceptions')
const { app_key } = require('../../../../config')

class AuthController {
  async login(req, res, next) {
    try {
      const credentials = await AdminModel.findOne({
        username: req.body.username,
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
            username: credentials.username,
          },
          role: 'admin',
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
