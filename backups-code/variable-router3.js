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
function variable_router(app) {

    // 匹配到路由的中间件
    // 获取middleware目录下的所有中间件文件并导入
    const middlewares_dir = fs.readdirSync(`${rootPath}/middlewares`)
    for (let middleware_file of middlewares_dir) {
        require(`${rootPath}middlewares/${middleware_file}`)(app)
    }

    // 循环modules
    const modules = fs.readdirSync(`${rootPath}modules`)
    for (let module of modules) {
        const module_controllers = fs.readdirSync(`${rootPath}modules/${module}/controllers`)
        // 循环controller获取controller对应路由文件
        for (let controller of module_controllers) {
            console.log(`${rootPath}modules/${module}/router/${controller}`)
            try {
                let router = require(`${rootPath}modules/${module}/router/${controller}`),
                    {stack} = router

                for (let layer of stack) {
                    // 判断methods是否为空，为空则为modules路由
                    // 替换正则
                    // path: '/login',
                    // regexp: /^\/login(?:[\/#\?](?=[]|$))?(?=[\/#\?]|[]|$)/i
                    // (?:[\/#\?](?=[]|$))?(?=[\/#\?]|[]|$)

                    if(layer.methods.length == 0) {
                        console.log('我进来啦')
                        let arr = reg_exp_str(layer.path, '/')
                        layer.regexp = new RegExp(`^\\/${arr.join('\\/')}(?:[\\/#\\?](?=[]|$))?(?=[\\/#\\?]|[]|$)`, "i")
                    }

                    // regexp: /^\/news[\/#\?]?$/i
                    // regexp: /^\/article\/news[\/#\?]?$/i
                    // let reg_exp_str = layer.path.split("/").filter(function (s) {
                    //     return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
                    // });
                    let arr = reg_exp_str(layer.path, '/')
                    // 数组头添加模块名称
                    arr.unshift(module)
                    // 修改path路径和正则，数组连接并改成正则表达式，i 大小写不敏感
                    // paths = `^\\/${reg_exp_str.join('\\/')}[\\/#\\?]?$`
                    layer.path = `/${module}${layer.path}`
                    layer.regexp = new RegExp(`^\\/${arr.join('\\/')}[\\/#\\?]?$`, "i")
                }
                console.log(router)
                app.use(router.routes()) //作用：启动路由
                app.use(router.allowedMethods())
            } catch (e) {
                console.log('==============================\n')
                console.warn(`${module}/controller/${controller} not found matching router`)
                console.log('\n==============================')
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
let reg_exp_str = (path, str) => {
    return path.split(str).filter(function (s) {
        return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
    });
}

module.exports = variable_router

