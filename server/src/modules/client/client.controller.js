const ClientModel = require('./model')
const { query, notFound } = require('../../helpers')

class ClientController {
  async get(req, res, next) {
    try {
      const clients = await ClientModel.paginate(
        {
          ...(req.query.name !== undefined
            ? query.regex('name', req.query.name)
            : {}),
          ...(req.query.status !== undefined && req.query.status !== ''
            ? query.bool('status', req.query.status)
            : {}),
        },
        {
          sort: query.sort(req.query.sort, req.query.order),
          page: req.query.page,
          limit: req.query.limit || 10,
        }
      )

      return res.status(200).json(clients)
    } catch (err) {
      next(err)
    }
  }

  async store(req, res, next) {
    try {
      await ClientModel.create(req.body)

      return res.status(201).json({ message: 'Team Created' })
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const updated = await ClientModel.updateOne(
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
      const updated = await ClientModel.updateOne(
        { _id: req.params.id },
        { status: req.body.status }
      )

      notFound(!updated.matchedCount, 'Team Not Found')

      return res.status(200).json({ message: 'Team Updated' })
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const deleted = await ClientModel.deleteOne({ _id: req.params.id })

      notFound(!deleted.deletedCount, 'Team Not Found')

      return res.status(200).json({ message: 'Team Deleted' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new ClientController()
