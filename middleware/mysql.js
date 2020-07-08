const mysql = require('promise-mysql');

async function mysqlConnecton(opt) {
  try {
    const pool = await mysql.createPool(opt);

    return {
      pool,
      query: pool.query.bind(pool)
    }
  } catch (error) {

  }
}

async function db(ctx, next) {
  if (!ctx.mysql) {
    ctx.mysql = await mysqlConnecton(this);
  }

  await next();
}

module.exports = db;