const TeamModel = require('./model')
const { query, notFound } = require('../../helpers')

class TeamController {
  async get(req, res, next) {
    try {
      const teams = await TeamModel.paginate(
        {
          ...(req.query.name !== undefined
            ? query.regex('name', req.query.name)
            : {}),
          ...(req.query.status !== undefined && req.query.status !== ''
            ? query.bool('status', req.query.status)
            : {}),
        },
        {
          populate: ['employees', 'leader'],
          sort: query.sort(req.query.sort, req.query.order),
          page: req.query.page,
          limit: req.query.limit || 10,
        }
      )

      return res.status(200).json(teams)
    } catch (err) {
      next(err)
    }
  }

  async store(req, res, next) {
    try {
      await TeamModel.create(req.body)

      return res.status(201).json({ message: 'Team Created' })
    } catch (err) {
      next(err)
    }
  }

  async show(req, res, next) {
    try {
      const team = await TeamModel.findById(req.params.id).populate([
        'employees',
        'leader',
      ])

      notFound(!team, 'Team Not Found')

      return res.status(200).json(team)
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const updated = await TeamModel.updateOne(
        { _id: req.params.id },
        req.body
      )

      notFound(!updated.matchedCount, 'Team Not Found')

      return res.status(200).json({ message: 'Team Updated' })
    } catch (err) {
      next(err)
    }
  }

  async updateStatus(req, res, next) {
    try {
      const updated = await TeamModel.updateOne(
        { _id: req.params.id },
        { status: req.body.status }
      )

      notFound(!updated.matchedCount, 'Team Not Found')

      return res.status(200).json({ message: 'Team Updated' })
    } catch (err) {
      next(err)
    }
  }

  async updateLeader(req, res, next) {
    try {
      const updated = await TeamModel.updateOne(
        { _id: req.params.id },
        { leader: req.body.employee_id }
      )

      notFound(!updated.matchedCount, 'Team Not Found')

      return res.status(200).json({ message: 'Team Updated' })
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const deleted = await TeamModel.deleteOne({ _id: req.params.id })

      notFound(!deleted.deletedCount, 'Team Not Found')

      return res.status(200).json({ message: 'Team Deleted' })
    } catch (err) {
      next(err)
    }
  }

  async addEmployees(req, res, next) {
    try {
      const updated = await TeamModel.updateOne(
        { _id: req.params.id },
        {
          $push: {
            employees: req.body.employee_id,
          },
        }
      )

      notFound(!updated.matchedCount, 'Team Not Found')

      return res.status(200).json({ message: 'Team Updated' })
    } catch (err) {
      next(err)
    }
  }

  async removeEmployees(req, res, next) {
    try {
      const updated = await TeamModel.updateOne(
        { _id: req.params.id },
        {
          $pull: {
            employees: req.params.employee_id,
          },
        }
      )

      notFound(
        !updated.matchedCount || !updated.modifiedCount,
        'Team Not Found'
      )

      return res.status(200).json({ message: 'Team Updated' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new TeamController()
