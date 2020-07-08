const url = require('url');

function contentParse() {
  return async (ctx, next) => {
    let method = ctx.method.trim();
    let path = ctx.req.url;

    if (method == 'GET') {
      let query = url.parse(path, true).query;
      Object.assign(ctx.get, query);
    } else if (method == 'POST') {
      let body = '';
      ctx.req.on('data', function (data) {
        body += data;
      }).on('end', function () {
        console.log('end');
        console.log(body);
      })
    } else {

    }

    await next();
  }
}

function parsePost() {
  return Promise(resolve, reject)
}


module.exports = contentParse;