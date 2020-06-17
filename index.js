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
            const middleware = this.middlewares.shift();
            if (middleware) {
                middleware(req, res, next);
                this.ctx = { req, res };
            }
        };


        res.end(res.body);
    }

    listen(...args) {
        console.log(`server is running ${args[0]}`)
        return http.createServer(this.callback.bind(this)).listen(...args);
    }
}

function build(options) {
    const app = new App();
    app.use(() => {
        console.log('wtf');
    }, options);

    return app;
}

module.exports = build;
