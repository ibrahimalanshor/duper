const EmployeeModel = require('./model')
const { query, notFound } = require('../../helpers')

class EmployeeController {
  async get(req, res, next) {
    try {
      const employees = await EmployeeModel.paginate(
        {
          ...(req.query.name !== undefined
            ? query.regex('name', req.query.name)
            : {}),
          ...(req.query.position !== undefined
            ? query.regex('position', req.query.position)
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

      return res.status(200).json(employees)
    } catch (err) {
      next(err)
    }
  }

  async store(req, res, next) {
    try {
      await EmployeeModel.create(req.body)

      return res.status(201).json({ message: 'Employee Created' })
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const updated = await EmployeeModel.updateOne(
        { _id: req.params.id },
        req.body
      )

      notFound(!updated.matchedCount, 'Employee Not Found')

      return res.status(200).json({ message: 'Employee Updated' })
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const deleted = await EmployeeModel.deleteOne({
        _id: req.params.id,
      })

      notFound(!deleted.deletedCount, 'Employee Not Found')

      return res.status(200).json({ message: 'Employee Deleted' })
    } catch (err) {
      next(err)
    }
  }

  async updateStatus(req, res, next) {
    try {
      const updated = await EmployeeModel.updateOne(
        { _id: req.params.id },
        { status: req.body.status }
      )

      notFound(!updated.matchedCount, 'Employee Not Found')

      return res.status(200).json({ message: 'Employee Updated' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new EmployeeController()
