const router = require('koa-router')(); //注意：引入的方式

// router.use('/news', async (ctx, next) => {
//     console.log('我是article中间件')
//     await next()
// })
// 当前页面可写中间件
router.get('/:id', ctx => {
    ctx.body=ctx.params.id
})
router.get('/article/news/:id', ctx => {
    ctx.body=ctx.params.id
})
router.get('/article/news/:id/:u_id', ctx => {
    ctx.body=ctx.params.id
})
module.exports = router
