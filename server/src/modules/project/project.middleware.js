const { checkLeader, checkTeam, checkWorker } = require('./validator')
const { AuthException } = require('../../exceptions')

module.exports = {
  leader: async (req, res, next) => {
    try {
      const auth = req.auth

      if (auth.role === 'employee') {
        await checkLeader(req.params.id, auth.user._id)
      }

      next()
    } catch (err) {
      next(new AuthException(err))
    }
  },
  team: async (req, res, next) => {
    try {
      const auth = req.auth

      if (auth.role === 'employee') {
        await checkTeam(req.params.id, auth.user._id)
      }

      next()
    } catch (err) {
      next(new AuthException(err))
    }
  },
  worker: async (req, res, next) => {
    try {
      const auth = req.auth

      if (auth.role === 'employee') {
        await checkWorker(
          req.params.id,
          req.params.board_id,
          req.params.task_id,
          auth.user._id
        )
      }

      next()
    } catch (err) {
      next(new AuthException(err))
    }
  },
}
