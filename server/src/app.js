const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')

const { error } = require('./middlewares')

class App {
  constructor(config = { port: 4000, routes: [] }) {
    this.app = express()
    this.port = config.port
    this.db = config.db

    this.setModule()
    this.setRoute(config.routes)
    this.setError()
  }

  setModule() {
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(express.json())

    this.app.use(cors())

    this.app.use(morgan('tiny'))

    this.app.use(
      '/static',
      express.static(path.resolve(__dirname, '../static'))
    )
  }

  setRoute(routes = []) {
    for (const route of routes) {
      this.app.use(route.path, route.router)
    }

    this.app.get('/', (req, res) => res.json('express app'))
  }

  setError() {
    this.app.use(error)
  }

  async connectDB() {
    await mongoose.connect(`${this.db.url}/${this.db.name}`)
  }

  listen() {
    this.app.listen(this.port, () => console.log(`App running at ${this.port}`))
  }
}

module.exports = App
