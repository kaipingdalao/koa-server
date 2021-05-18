const fs = require('fs')
// 所有匹配到路由的中间件
const middlewares = app => {
  app.use(async (ctx, next) => {
    ctx.upload = (fileName, uploadPath, type=null) => {

      // 上传单个文件
      const file = ctx.request.files[fileName] // 获取上传文件
      uploadPath = `${uploadPath}/${file.name}`.replace(/\/\//g, '/')
      // 创建可读流
      const reader = fs.createReadStream(file.path);
      let filePath = uploadPath
      // 创建可写流
      const upStream = fs.createWriteStream(filePath);
      // 可读流通过管道写入可写流
      reader.pipe(upStream);
    }
    await next()
  })

}


// // 上传单个文件
// console.log(ctx.request.files.tupian, '==========================')
// const file = ctx.request.files.tupian // 获取上传文件
// // 创建可读流
// console.log(ctx.settings.ROOT_DIR)
// const reader = fs.createReadStream(file.path);
// // let filePath = path.join(__dirname, '/public/upload/') + `/${file.name}`;
// let filePath = `${ctx.settings.ROOT_DIR}public/upload/${file.name}`
// console.log(filePath)
// // 创建可写流
// const upStream = fs.createWriteStream(filePath);
// // 可读流通过管道写入可写流
// reader.pipe(upStream);

module.exports = middlewares
