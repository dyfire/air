const Url = require('url');
const queryString = require('querystring');
const {
  EventEmitter
} = require('events');

class Router extends EventEmitter {
  constructor(opt) {
    super();
    this.router = [];
  }

  post(path, fn) {
    let map = new Map();
    map.set(path, fn);
    this.router['POST'] = map;
    return this;
  }

  get(path, fn) {
    let map = new Map();
    map.set(path, fn);
    this.router['GET'] = map;
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
        fn && await fn(ctx);
        break;
      }
    }
  }

  register() {
    return async (ctx, next) => {
      await this.parse(ctx);
      await next();
    }
  }
}

module.exports = Router;