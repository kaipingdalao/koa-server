const path = require('path')
let {mysqlQuery, mysql} = require(path.join(process.cwd(), './lib/mysql'))

mysql = mysql.table('todo')

module.exports = {
  getList: async (timestampStart, timestampEnd) => {
    // let sql = `
    //   SELECT
    //     id,
    //     title,
    //     date,
    //     done_state,
    //     everyday_id
    //   FROM
    //     todo
    //   WHERE
    //     ${timestampStart} <= date
    //     AND date <= ${timestampEnd}
    //     AND done_state != 2
    //   ORDER BY
    //     date DESC;
    //     `
    // return await mysqlQuery(sql)
    //   .then(res => {
    //     return res
    //   })
    return await mysql.fields('id','title','date','done_state','everyday_id')
      .where(`${timestampStart} <= date`, `date <= ${timestampEnd}`,'done_state != 2')
      .select()
  },
  setState: async (id) => {
    let sql = `
      UPDATE todo 
      SET done_state =
      CASE
        done_state 
        WHEN 0 THEN
        1 
        WHEN 1 THEN
        0 
        END 
      WHERE
        id = ${id}
    `
    return await mysql.query(sql)
  },
  allDone: async (timestampStart, timestampEnd) => {
    // let sql = `
    //   UPDATE todo
    //   SET done_state = 1
    //   WHERE
    //     done_state != 2
    //     AND ${timestampStart} <= date
    //     AND date <= ${timestampEnd}
    // `
    // return await mysqlQuery(sql)
    //   .then(res => {
    //     console.log(res)
    //     return res
    //   })
    return await mysql.fields('done_state')
      .update(1)
      .where('done_state !=2', `${timestampStart} <= date`, `date <= ${timestampEnd}`)
      .execute().then(res => {
        return res;
      })
  },
  add: async (title, date) => {
    const {year, month, day} = date
    let timestamp = parseInt((new Date(year, month, day)).getTime() / 1000)
    // let sql = `
    //   INSERT INTO todo ( title, date)
    //     VALUES
    //     ( "${title}", ${timestamp} );
    //     `
    // const getNewIdSql = `select last_insert_id() as newTodoId`
    // const result = await mysqlQuery(sql)
    // return result.affectedRows == 1 ? await mysqlQuery(getNewIdSql) : false
    const result = await mysql.fields('title', 'date')
      .insert([title, timestamp])
      .execute()
    return result.affectedRows == 1 ? result : false
  },
  addEveryday: async (addList) => {
    let valuesList = []
    for (let item of addList) {
      valuesList.push(`('${item.title}', ${item.date}, ${item.everydayId})`)
    }
    const values = valuesList.join(',')
    let sql = `
      INSERT INTO todo ( title, date, everyday_id)
        VALUES 
        ${values};
        `
    const getNewIdSql = `select last_insert_id() as newTodoId`
    const result = await mysqlQuery(sql)
    return result.affectedRows ? await mysqlQuery(getNewIdSql) : false
  },
  del: async id => {
    let sql = `
      UPDATE todo 
      SET done_state = 2
      WHERE
        id = ${id}
    `
    return await mysqlQuery(sql)
      .then(res => {
        return res
      })
  }
}
