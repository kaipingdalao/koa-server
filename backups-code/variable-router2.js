const path = require('path')
const fs = require('fs')
// 根目录
const rootPath = path.join(__dirname, '../')

/**
 * 实现动态导入模块路由和中间件
 * 注意require路径，require本文件的路径和require后相对本文件的路径
 * 将路由和中间件动态挂载到koa实例
 * app:     koa实例
 * return:  null
 **/
function variable_router(app) {

    // 匹配到路由的中间件
    // 获取middleware目录下的所有中间件文件并导入
    const middlewares_dir = fs.readdirSync(`${rootPath}/middlewares`)
    for (let middleware_file of middlewares_dir) {
        require(`${rootPath}middlewares/${middleware_file}`)(app)
    }

    // 相对路径为require本文件的目录
    // let modules = fs.readdirSync('./modules')
    const modules = fs.readdirSync(`${rootPath}modules`)
    for (let module of modules) {
        const module_controllers = fs.readdirSync(`${rootPath}modules/${module}/router`)
        console.log(module_controllers)
        for (let controller of module_controllers) {
            console.log(`${rootPath}modules/${module}/router/article`)
            let router = require(`${rootPath}modules/${module}/router/${controller}`),
                {stack} = router

            for (let layer of stack) {
                // regexp: /^\/news[\/#\?]?$/i
                // regexp: /^\/article\/news[\/#\?]?$/i
                let reg_exp_str = layer.path.split("/").filter(function (s) {
                    return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
                });
                // 数组头添加模块名称
                reg_exp_str.unshift(module)
                // 修改path路径和正则，数组连接并改成正则表达式，i 大小写不敏感
                // paths = `^\\/${reg_exp_str.join('\\/')}[\\/#\\?]?$`
                layer.path = `/${module}${layer.path}`
                layer.regexp = new RegExp(`^\\/${reg_exp_str.join('\\/')}[\\/#\\?]?$`, "i")
            }

            app.use(router.routes()) //作用：启动路由
            app.use(router.allowedMethods())
        }
    }
}

module.exports = variable_router

