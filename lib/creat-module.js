const {program} = require('commander')
const fs = require('fs')
program
  .option('-m, --module <name>', 'module name')
  .option('-r, --router <name>', 'router name', 'router')
  .option('-c, --controller <name>', 'controller name', 'controller')
  .option('-d, --model <name>', 'model name', 'model')

program.parse(process.argv)

const moduleName = program.module,
  {router, controller, model} = program

const rootPath = process.cwd()

if (fs.existsSync(`${rootPath}/modules/${moduleName}`)) throw new Error(`module ${moduleName} is exist`);

// 创建目录
fs.mkdirSync(`${rootPath}/modules/${moduleName}`)
fs.mkdirSync(`${rootPath}/modules/${moduleName}/controllers`)
fs.mkdirSync(`${rootPath}/modules/${moduleName}/models`)
fs.mkdirSync(`${rootPath}/modules/${moduleName}/router`)

const routerTemplate = `const router = require('koa-router')(); //注意：引入的方式
const ${moduleName}Controller = require('../controllers/${moduleName}')

// 当前页面可写中间件
// router.get(path, middleware, callback)
router.get('/test', async (ctx, next) => {
    await next()
  },
  async ctx => {
    let data = await ${moduleName}Controller.test()
    ctx.send(200, data)
  })

module.exports = router
`

const controllerTemplate = `const {get} = require('../models/${moduleName}')

module.exports = {
  test: async () => {
    return await get()
  }
}
`

const modelTemplate = `const path = require('path')
const {mysqlCustom, mysqlQuery} = require(path.join(process.cwd(), './lib/mysql'))

const mysql = () => {
  return new mysqlCustom().table('${moduleName}')
}

module.exports = {
  get: async () => {
    return await mysql().fields('id', 'title')
      .select()
  }
}
`

const data = [
  {dir: 'router', fileName: router, content: routerTemplate},
  {dir: 'controllers', fileName: controller, content: controllerTemplate},
  {dir: 'models', fileName: model, content: modelTemplate}
]

// 创建文件
for (let item of data) {
  fs.writeFile(
    `${rootPath}/modules/${moduleName}/${item.dir}/${item.fileName}.js`,
    item.content,
    error => {
      console.log(error ? error : `creat ${item.dir} done`)
    })
}
