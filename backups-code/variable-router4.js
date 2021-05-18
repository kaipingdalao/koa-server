const path = require('path')
const fs = require('fs')
// 根目录
const rootPath = path.join(__dirname, '../')

/**
 * 实现动态导入模块路由和中间件
 * 获取modules的controllers，并引入controller对应的router
 * 将路由和中间件动态挂载到koa实例
 * app:     koa实例
 * return:  null
 **/
const variable_router = app => {

    // 匹配到路由的中间件
    // 获取middleware目录下的所有中间件文件并导入
    const middlewares_dir = fs.readdirSync(`${rootPath}/middlewares`)
    for (let middleware_file of middlewares_dir) {
        require(`${rootPath}middlewares/${middleware_file}`)(app)
    }

    // 循环modules
    const modules = fs.readdirSync(`${rootPath}modules`)
    for (let module of modules) {
        const module_router = fs.readdirSync(`${rootPath}modules/${module}/router`)
        // 循环router文件夹获取router文件
        for (let controller of module_router) {

            try {
                // 路由信息存放在router内的stack
                let router = require(`${rootPath}modules/${module}/router/${controller}`),
                    {stack} = router

                for (let layer of stack) {

                    let arr = split_str(layer.path, '/')
                    // 数组头添加模块名称
                    arr.unshift(module)
                    // 修改path路径和正则，数组连接并改成正则表达式，i 大小写不敏感
                    layer.path = `/${module}${layer.path}`

                    // 模块路由正则：  /^\/article\/news[\/#\?]?$/i
                    // 模块中间件正则：/^\/login(?:[\/#\?](?=[]|$))?(?=[\/#\?]|[]|$)/i
                    let router_reg_exp = `^\\/${arr.join('\\/')}[\\/#\\?]?$`,
                        module_middleware_reg_exp = `^\\/${arr.join('\\/')}(?:[\\/#\\?](?=[]|$))?(?=[\\/#\\?]|[]|$)`

                    // methods为空则为modules路由中间件，即使用router.use()添加的路由中间件
                    layer.regexp = layer.methods.length == 0
                        ? new RegExp(module_middleware_reg_exp, "i")
                        : new RegExp(router_reg_exp, "i")
                }
                app.use(router.routes()) //作用：启动路由
                app.use(router.allowedMethods())
            } catch (e) {
                console.warn(`${module}/controller/${controller} not found matching router`)
            }
        }
    }
}

/**
 * 通过指定str截取字符串，并去除空值
 * path:    str
 * str:     str
 * return:  arr
 **/
let split_str = (path, str) => {
    return path.split(str).filter(function (s) {
        // TODO 注：IE9(不包含IE9)以下的版本没有trim()方法，待补充
        return s && s.trim()
    })
}

module.exports = variable_router

