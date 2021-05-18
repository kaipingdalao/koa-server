const mysqlPackage = require('mysql')
const path = require('path')
const {mysqlConfig} = require(path.join(process.cwd(), './config/db'))

// const pool = mysql.createPool({
//     host:       mysqlConfig.host,
//     user:       mysqlConfig.user,
//     password:   mysqlConfig.password,
//     port:       mysqlConfig.port,
//     database:   mysqlConfig.database
// })
const pool = mysqlPackage.createPool(mysqlConfig)

const mysqlQuery = (sql, val) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      err ? reject(err)
        : connection.query(sql, val, (err, res) => {
          err ? reject(err)
            : resolve(res), connection.release()
        })
    })
  })
}


class mysqlCustom {
  constructor() {
  }

  tableName = ''
  whereList = []
  fieldList = []
  valueList = []
  orderBy = ''
  state = ''

  table = (tableName) => {
    this.tableName = tableName
    return this
  }

  fields = (...fields) => {
    this.fieldList = fields
    return this
  }

  order = (field, order = 'DESC') => {
    if (order != 'DESC' || order != 'ASC' && !field) return ''
    this.orderBy = ` ORDER BY ${field} ${order}`
    return this
  }

  // [1,2,3]
  insert = (...valueArr) => {
    this.state = 'insert'
    for (let item of valueArr) {
      // TODO
      for (let i in item) {
        item[i] = `'${item[i]}'`
      }
      this.valueList.push(`(${item.join(', ')})`)
    }
    return this
  }

  // [title='test', date=1234345]
  update = (...values) => {
    this.state = 'update'
    this.valueList = values
    return this
  }

  delete = () => {
    this.state = 'delete'
    return this
  }

  where = (...wheres) => {
    this.whereList = [...this.whereList, ...wheres]
    return this
  }

  joinSql = () => {
    const fields = this.fieldList.length > 0 ? this.fieldList.join(',') : '*',
      values = this.valueList.length > 0 ? ` ${this.valueList.join(',')}` : '',
      wheres = this.whereList.length > 0 ? ` WHERE ${this.whereList.join(' AND ')}` : ''

    switch (this.state) {
      case 'insert':
        return `INSERT INTO ${this.tableName} (${fields}) VALUES ${values}`
      case 'update':
        if (this.whereList.length == 0) throw new Error('where is null')
        const dataArr = []
        this.fieldList.forEach((value, index) => {
          dataArr.push(`${value} = '${this.valueList[index]}'`)
        })
        return `UPDATE  ${this.tableName} SET ${dataArr.join(',')} ${wheres}`
      case 'delete':
        if (this.whereList.length == 0) throw new Error('where is null')
        return `DELETE FROM ${this.tableName} ${wheres}`
    }
  }

  execute = async () => {
    const sql = this.joinSql()
    console.log(sql)
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        err ? reject(err)
          : connection.query(sql, (err, res) => {
            err ? reject(err)
              : resolve(res), connection.release()
          })
      })
    })
  }

  select = () => {
    const fields = this.fieldList.length > 0 ? this.fieldList.join(',') : '*',
      wheres = this.whereList.length > 0 ? ` WHERE ${this.whereList.join(' AND ')}` : '',
      order = this.orderBy ? this.orderBy : '',
      sql = `SELECT ${fields} FROM ${this.tableName} ${wheres} ${order}`
    console.log(sql)
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        err ? reject(err)
          : connection.query(sql, (err, res) => {
            err ? reject(err)
              : resolve(res), connection.release()
          })
      })
    })
  }

  query = (sql) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        err ? reject(err)
          : connection.query(sql, (err, res) => {
            err ? reject(err)
              : resolve(res), connection.release()
          })
      })
    })
  }
}

module.exports = {mysqlQuery, mysqlCustom}
