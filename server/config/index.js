if (process.env.NODE_ENV === 'development') {
  require('dotenv/config')
}

const path = require('path')

module.exports = {
  app_port: process.env.APP_PORT ?? 4000,
  app_url: process.env.APP_URL,
  app_key: process.env.APP_KEY,
  static_url: process.env.STATIC_URL,
  db: {
    url: process.env.DB_URL
  },
  static_path: path.resolve(__dirname, '../static'),
}
