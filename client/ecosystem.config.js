module.exports = {
  apps : [{
    name   : "Duper Client",
    script : "serve",
    env: {
      PM2_SERVE_PATH: './dist/',
      PM2_SERVE_PORT: '3001',
      PM2_SERVE_SPA: 'true',
      PM2_SERVE_HOMEPAGE: '/index.html'
    }
  }]
}
