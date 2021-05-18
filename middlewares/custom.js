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
    ctx.dateToTiemstamp = (year, month, day) => {
      if (!year || !month || !day) throw new Error('参数错误')
      const date = new Date(year, month - 1, day)
      // const startTiemstamp = parseInt(date.getTime() / 1000)
      const startTiemstamp = date.getTime()
      date.setHours(23)
      date.setMinutes(59)
      date.setSeconds(59)
      date.setMilliseconds(999)
      // const endTiemstamp = parseInt(date.getTime() / 1000)
      const endTiemstamp = date.getTime()
      return {startTiemstamp, endTiemstamp}
    }
    await next()
  })

}

module.exports = middlewares
