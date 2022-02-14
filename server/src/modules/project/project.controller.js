const ProjectModel = require('./model')
const { query, notFound } = require('../../helpers')

class ProjectController {
  async get(req, res, next) {
    try {
      const projects = await ProjectModel.paginate(
        {
          ...(req.query.name !== undefined
            ? query.regex('name', req.query.name)
            : {}),
          ...(req.query.status !== undefined && req.query.status !== ''
            ? query.value('status', req.query.status)
            : {}),
        },
        {
          select: '-boards -documents',
          populate: ['team', 'client'],
          sort: query.sort(req.query.sort, req.query.order),
          limit: req.query.limit || 10,
          page: req.query.page,
        }
      )

      return res.status(200).json(projects)
    } catch (err) {
      next(err)
    }
  }

  async store(req, res, next) {
    try {
      await ProjectModel.create(req.body)

      return res.status(201).json({ message: 'Project Created' })
    } catch (err) {
      next(err)
    }
  }

  async show(req, res, next) {
    try {
      const project = await ProjectModel.findById(req.params.id).populate([
        'team',
        'client',
      ])

      notFound(!project, 'Project Not Found')

      return res.status(200).json(project)
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const updated = await ProjectModel.updateOne(
        { _id: req.params.id },
        req.body
      )

      notFound(!updated.matchedCount, 'Project Not Found')

      return res.status(200).json({ message: 'Project Updated' })
    } catch (err) {
      next(err)
    }
  }

  async updateStatus(req, res, next) {
    try {
      const updated = await ProjectModel.updateOne(
        { _id: req.params.id },
        { status: req.body.status }
      )

      notFound(!updated.matchedCount, 'Project Not Found')

      return res.status(200).json({ message: 'Project Updated' })
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const deleted = await ProjectModel.deleteOne({ _id: req.params.id })

      notFound(!deleted.deletedCount, 'Project Not Found')

      return res.status(200).json({ message: 'Project Deleted' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new ProjectController()
