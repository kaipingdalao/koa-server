# server

## 目录结构

```$xslt
#   backups-code // 备份代码目录
#   lib // 资源库
#       variable-router.js // 动态路由实现
#   middlewares // 最外层中间件目录，每次请求都会执行
#   modules // 模块目录
#       module_name
#           controllers // 控制器目录
#           models // 模型目录
#           router // 模块内部路由
#   server.js // 入口
```

### 创建module
```shell script
npm run creat-module -- -m test
npm run creat-module -- -m test -r router-test -c controller-test -d model-test
```
参数：
```shell script
-m --module moduleName (必须)
-r --router routerName
-c --controller controllerName
-d --model modelName
```

### `middlewares` 文件夹
文件夹内文件统一导出一个需要`koa`实例参数的函数，在这里定义外层中间件
```js
const middlewares = app => {
    app.use(async (ctx, next) => {
        console.log('index中间件1')
        await next()
        console.log('请求完了完了')
    })
    app.use(async (ctx, next) => {})
}

module.exports = middlewares
```

### `controllers` 文件夹
文件夹内文件统一导出一个`controllers`对象，在这里处理响应
```js
const controllers = {
    get_get_content_by_id: ctx => {
        // ...业务逻辑
    }
}
module.exports = controllers
```

### `router` 文件夹
文件夹内文件统一导出一个`router`对象
文件头引入`router`和`module_controller`
```js
const router = require('koa-router')(); //注意：引入的方式
const article_controller = require('../controllers/article')

router.use('/news', (ctx, next) => {
    console.log(`
        我是 'article/news/' 路由之后的中间件，
        所有经过 '/news' 的路由都会执行到这里
    `)
    next()
})
// 当前页面可写中间件
router.get('/', (ctx, next) => {
        console.log('我是当前请求的中间件')
        next()
    },
    ctx => {
        console.log(article_controller.test())
        ctx.body = "我是征文";
    })

router.get('/news', (ctx, next) => {
    ctx.body = `<h1>news</h1>`
});

module.exports = router

```

### `router  404/not found` 问题
检查`router.use()`是否存在异步中间件，如果存在异步中间件，则需要将顶层的`use`中的`callback`设为同步
```js
router.use('/admin', async (ctx, next) => {
    // ...
    await next()
})
```
原因：
下层`use`的回调是异步函数，而上层`use`不是，
所以执行`next()`后，不会等待下层`use`的异步操作完成，而直接返回`response`，
从而下层`use`回调中异步操作之后的代码没有影响到这个返回的`response`（此时，`response`没有设置任何返回信息，`koa`会默认是404），
而在下层`use`的异步操作完成之后，后面的代码会执行（打断点能有反应的原因），
但此时`response`已经返回，后面代码虽然改变了`response`，但是已经不会发送给客户端了。
