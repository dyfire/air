const url = require('url');

module.exports = (ctx, next) => {
    req.query = url.parse(req.url, true).query;
    console.log(req.query);
    next();
}
