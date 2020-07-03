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
  console.log('do');
  if (!ctx.mysql) {
    console.log('init');
    ctx.mysql = await mysqlConnecton(this);
  }

  next();
}

module.exports = db;