const url = require('url');
const querystring = require("querystring");

function contentParse() {
  return async (ctx, next) => {
    let method = ctx.method.trim();
    let path = ctx.req.url;

    let query = url.parse(path, true).query;
    Object.assign(ctx.get, query);

    if (method == 'POST') {
      let body = [];
      ctx.req.on('data', function (data) {
        body.push(data)
      }).on('end', function () {
        body = Buffer.concat(body).toString();
        let query = querystring.decode(body);
        Object.assign(ctx.post, query);
      })
    } else {

    }

    await next();
  }
}

module.exports = contentParse;
