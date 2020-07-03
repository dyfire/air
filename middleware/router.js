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
    let match = false;
    const method = ctx.req.method;
    ctx.param = queryString.parse(query);

    for (const [k, fn] of this.router[method].entries()) {
      if (typeof fn !== 'function') {
        throw new Error('callback is not function');
      }

      // 全匹配
      if (k == pathname) {
        match = true;
      } else {
        const stacks = k.split('/');
        const urls = pathname.split('/');

        if (stacks.length === urls.length) {
          let param = {};
          for (let i = 0; i < stacks.length; i++) {
            if (stacks[i].startsWith(':')) {
              const k = stacks[i].split(':')[1];
              stacks[i] = urls[i];
              param[k] = urls[i];
            }
          }

          if (stacks.join('/').trim() === pathname) {
            match = true;
            Object.assign(ctx.param, param);
          }
        }
      }

      if (match) {
        return fn && await fn(ctx);
      }
    }

    const error = async (ctx) => {
      ctx.body = '404';
    }

    await error(ctx);
  }

  router() {

  }

  register() {
    return async (ctx, next) => {
      await this.parse(ctx);
      await next();
    }
  }
}

module.exports = Router;