const path = require('path')
// 所有匹配到路由的中间件
const middlewares = app => {
  app.use(async (ctx, next) => {
    ctx.settings = {
      // POST_MAX_SIZE : 40 , //MB
      // UPLOAD_MAX_FILE_SIZE: 40, //MB
      ROOT_DIR : path.join(__dirname, '../')
    }
    await next()
  })

}

module.exports = middlewares
