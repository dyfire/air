const http = require('http');
const events = require('events');
const url = require('url');
const Router = require('./middleware/router');

class App extends events.EventEmitter {
  constructor() {
    super();
    this.middlewares = [];
    this.ctx = {};
    this.on('error', (err) => {
      console.log(err);
    })
  }

  use(fn) {
    if (typeof fn != 'function') {
      throw new TypeError('not function');
    }

    this.middlewares.push(fn);
    return this;
  }

  callback(req, res) {
    var pathname = url.parse(req.url).pathname;
    if (pathname == '/favicon.ico') {
      return;
    }

    this.init(req, res);
    const fn = (ctx, next, i = 0) => {
      let func = this.middlewares[i];

      if (i === this.middlewares.length) {
        func = next;
      }

      if (!func) {
        return Promise.resolve();
      }

      try {
        return Promise.resolve(func(ctx, fn.bind(this, ctx, next, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }

    const handler = (req, res) => {
      Object.assign(this.ctx, { req, res });
      const ctx = this.ctx;

      fn(ctx).then(() => {
        return this.responsed(ctx);
      }).catch(err => {
        console.log(err);
      });
    }

    return handler(req, res);
  }

  listen(...args) {
    console.log(`server is running ${args[0]}`);
    return http.createServer(this.callback.bind(this)).listen(...args);
  }

  responsed(ctx) {
    let body = ctx.body;

    return ctx.res.end(body);
  }

  init(req, res) {
    Object.assign(this.ctx, { method: req.method });
    Object.assign(this.ctx, { get: {} });
    Object.assign(this.ctx, { post: {} });
  }
}

module.exports = App;