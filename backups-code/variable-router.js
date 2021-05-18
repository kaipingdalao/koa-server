
// // 动态导入模块路由
// let modules = fs.readdirSync('./modules')
// for (let module of modules) {
//     // require(`./modules/${module}/router`)(app)
//
//     let router = require(`./modules/${module}/router`),
//         {stack} = router
//
//     for (let layer of stack) {
//         // regexp: /^\/news[\/#\?]?$/i
//         // regexp: /^\/article\/news[\/#\?]?$/i
//         let reg_exp_str = layer.path.split("/").filter(function (s) {
//             return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
//         });
//         // 数组头添加模块名称
//         reg_exp_str.unshift(module)
//         // 修改path路径和正则，数组连接并改成正则表达式，i 大小写不敏感
//         // paths = `^\\/${reg_exp_str.join('\\/')}[\\/#\\?]?$`
//         layer.path = `/${module}${layer.path}`
//         layer.regexp = new RegExp(`^\\/${reg_exp_str.join('\\/')}[\\/#\\?]?$`, "i");
//     }
//
//     app.use(router.routes()); //作用：启动路由
//     app.use(router.allowedMethods());
//
// }
