// 所有匹配到路由的中间件
const middlewares = app => {
    // app.use(async (ctx, next) => {
    //     console.log('index中间件1')
    //     await next()
    //     console.log('请求完了完了')
    // })
    app.use(async (ctx, next) => {
        console.log(ctx.url)
        await next()
    })

}

module.exports = middlewares
