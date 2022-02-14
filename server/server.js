const App = require('./src/app.js')
const config = require('./config')
const routes = require('./src/routes')

const app = new App({
  port: config.app_port,
  db: config.db,
  routes,
})

app
  .connectDB()
  .then(() => console.log('Database Connected'))
  .then(() => app.listen())
  .catch(err => console.log(err))
