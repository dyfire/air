const http = require('http');
const events = require('events');

class App extends events.EventEmitter {
    constructor() {
        super();
        this.middlewares = [];
        this.ctx = {};
    }

    use(fn) {
        if (typeof fn != 'function') {
            throw new TypeError('not function');
        }

        this.middlewares.push(fn);
        return this;
    }

    callback(req, res) {
        const next = () => {
            let i = 0;
            let fn = this.middlewares[i];

            if (i === this.middlewares.length) {
                return Promise.resolve();
            } else {
                try {
                    return Promise.resolve(fn(req, res, (i + 1)));
                } catch (err) {
                    return Promise.reject(err);
                }
            }
        };

        let func = next;
        console.log(func());
        return res.end('hhh');
    }

    listen(...args) {
        console.log(`server is running ${args[0]}`)
        return http.createServer(this.callback.bind(this)).listen(...args);
    }
}

function build(options) {
    const app = new App();
    app.use(() => {
        setTimeout(() => {
            console.log('111');
        }, 2000);
    });

    app.use(() => {
        setTimeout(() => {
            console.log('hhh');
        }, 1000);
    })

    return app;
}

module.exports = build;
