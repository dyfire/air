const Url = require('url');
const queryString = require('querystring');
const {
  EventEmitter
} = require('events');

class Router extends EventEmitter {
  constructor(opt) {
    super();
    this.router = [];
    this.method = [
      'GET',
      'POST'
    ];

    for (const item of this.method) {
      this.router[item] = new Map();
    }
  }

  post(path, fn) {
    this.router['POST'].set(path, fn);
    return this;
  }

  get(path, fn) {
    this.router['GET'].set(path, fn);
    return this;
  }

  async parse(ctx) {
    const {
      pathname,
      query
    } = Url.parse(ctx.req.url);
    const method = ctx.req.method;
    ctx.param = queryString.parse(query);

    for (let [k, fn] of this.router[method].entries()) {
      if (k == pathname) {
        return fn && await fn(ctx);
      } else {

      }
    }

    const error = async (ctx) => {
      ctx.body = '404';
    }

    await error(ctx);
  }

  register() {
    return async (ctx, next) => {
      await this.parse(ctx);
      await next();
    }
  }
}

module.exports = Router;