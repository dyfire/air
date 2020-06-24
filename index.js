const http = require('http');
const events = require('events');

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
        this.ctx = {
            req, res
        }

        const fn = (ctx, next) => {
            let i = i || 0;
            let func = this.middlewares[i];

            if (!fn) {
                return Promise.resolve();
            }

            if (i === this.middlewares.length) {
                func = next;
            }

            try {
                return Promise.resolve(func(ctx, fn.bind(this, ctx, i + 1)));
            } catch (err) {
                return Promise.reject(err);
            }
        }

        fn(this.ctx);
    }

    listen(...args) {
        console.log(`server is running ${args[0]}`);
        return http.createServer(this.callback.bind(this)).listen(...args);
    }
}

function build(options) {
    const app = new App();
    app.use(async (ctx, next) => {
        setTimeout(() => {
            console.log('111');
        }, 2000);

        await next();
    });

    app.use(async (ctx, next) => {
        setTimeout(() => {
            console.log('111');
        }, 2000);

        ctx.res.end('hello body');
        await next();
    });

    return app;
}

module.exports = build;
