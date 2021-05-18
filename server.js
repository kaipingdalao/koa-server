const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');
const Koa = require('koa');
const app = new Koa();

// 处理跨域
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
});

app.use(koaBody({
  multipart: true
}));

// 解析request的body的功能(post请求)
app.use(bodyParser())

const variableRouter = require('./lib/variable-router')(app)

app.listen(3003, () => {
  console.log('listening 3003')
});

