const path = require('path')
const {mysqlCustom, mysqlQuery} = require(path.join(process.cwd(), './lib/mysql'))

const mysql = () => {
  return new mysqlCustom().table('article')
}

module.exports = {
  getArticleList: async (page, size) => {
    let limit = (page && size ? `${page},${size}` : false) ? `limit ${page},${size}` : '',
      // TODO 操作当前表
      sql = `
        SELECT
            article.id,
            article.title,
            article.input_time,
            article.click_count,
            article.category_id,
            category.title AS category_title 
        FROM
            article,
            category 
        WHERE
            article.category_id = category.id 
        ORDER BY
            article.click_count DESC ${limit};
        `
    return await mysqlQuery(sql)
      .then(res => {
        return res
      })
  },
  getArticle: async (id) => {
    if (!!!Number(id)) return false
    const sql = `
      SELECT
          article.id,
          article.title,
          article.content,
          article.input_time,
          article.category_id,
          category.title AS category_title 
      FROM
          article,
          category 
      WHERE
          article.id = ${id} 
          AND article.category_id = category.id;
    `
    return await mysqlQuery(sql)
      .then(res => {
        return res
      })
  },
  addArticle: async (title, content, categoryId, date, img) => {
    return await mysql().fields('title','content', 'category_id', 'input_time', 'img')
      .insert([title, content, categoryId, date, img])
      .execute()
  }
}
