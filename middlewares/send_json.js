// 所有匹配到路由的中间件
const middlewares = app => {
    // app.use(async (ctx, next) => {
    //     ctx.send = json => {
    //         ctx.set("Content-Type", "application/json")
    //         ctx.body = JSON.stringify(json)
    //     }
    //     await next()
    // })

    app.use(async (ctx, next) => {
        ctx.send = (code, data) => {
            ctx.body = {code, data}
        }
        await next()
    })

}

module.exports = middlewares
