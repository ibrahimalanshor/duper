const AdminModel = require('./model')
const { query, notFound } = require('../../helpers')

class AdminController {
  async get(req, res, next) {
    try {
      const admins = await AdminModel.paginate(
        {
          ...(req.query.username !== undefined
            ? query.regex('username', req.query.username)
            : {}),
        },
        {
          sort: query.sort(req.query.sort, req.query.order),
          page: req.query.page,
          limit: req.query.limit || 10,
        }
      )

      return res.status(200).json(admins)
    } catch (err) {
      next(err)
    }
  }

  async store(req, res, next) {
    try {
      await AdminModel.create(req.body)

      return res.status(201).json({ message: 'Admin Created' })
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const updated = await AdminModel.updateOne(
        { _id: req.params.id },
        req.body
      )

      notFound(!updated.matchedCount, 'Admin Not Found')

      return res.status(200).json({ message: 'Admin Updated' })
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const deleted = await AdminModel.deleteOne({ _id: req.params.id })

      notFound(!deleted.deletedCount, 'Admin Not Found')

      return res.status(200).json({ message: 'Admin Deleted' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new AdminController()
