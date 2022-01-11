const BASE_SHARED = './packages'
const port = process.env.port || process.env.npm_config_port || 8080 // dev port
const SEV_CONF = {
  port: port,
  open: true,
  overlay: {
    warnings: false,
    errors: true
  }
}
Object.assign(SEV_CONF, {
  proxy: {
    '/scm/v1': {
      target: 'http://47.104.81.57/',
      changeOrigin: true
    }
  }
})
module.exports = {
  BASE_SHARED,
  SEV_CONF
}
