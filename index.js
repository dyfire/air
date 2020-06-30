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
            const ctx = {
                req, res
            }

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
}

function build(options) {
    const app = new App();
    const one = async (ctx, next) => {
        await setTimeout(() => {
            console.log('111');
        }, 200);

        await next();
    };

    const two = async (ctx, next) => {
        await setTimeout(() => {
            console.log('222');
        }, 100);
        ctx.body = "hahha";

        await next();
    };

    app.use(one);
    app.use(two);
    return app;
}

module.exports = build;
