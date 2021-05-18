const path = require('path')
const {mysqlCustom} = require(path.join(process.cwd(), './lib/mysql'))

const mysql = () => {
  return new mysqlCustom().table('category')
}

module.exports = {
  getCategoryList: async () => {
    return await mysql().fields('id', 'title').select()
  },

  categoryArticleCount: async () => {
    const sql = `SELECT category_id AS "id",(SELECT title FROM category WHERE id=category_id) AS "title",COUNT(category_id) AS "count",CAST(sum(click_count) AS SIGNED) AS "click_count" FROM article GROUP BY category_id ORDER BY click_count DESC`
    return await mysql().query(sql)
  }
  // 栏目文章数量统计
  // sql
  // SELECT category_id AS "category_id", ( SELECT title FROM category WHERE id = category_id ) AS "category_title", COUNT( category_id ) AS "count" FROM article GROUP BY category_id
}
