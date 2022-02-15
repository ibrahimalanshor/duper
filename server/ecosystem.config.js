module.exports = {
  apps : [{
    name   : "Duper Server",
    script : "node ./server.js",
    env: {
      APP_PORT: 4000,
      APP_URL: 'http://localhost:4000',
      APP_KEY: 'prominyamin',

      STATIC_URL: 'http://localhost:4000/static',

      DB_URL: 'mongodb://localhost:27017',
      DB_NAME: 'promin'
    }
  }]
}
