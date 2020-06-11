const http = require('http');
const events = require('events');

class App extends events.EventEmitter {
    constructor() {
        super();
        this.middlewares = [];
        this.ctx = {};
    }

    use(fn) {
        this.middlewares.push(fn);
    }

    runHook() {

    }

    callback(req, res) {
        const next = () => {
            const middleware = this.middlewares.shift();
            if (middleware) {
                middleware(req, res, next);
                this.ctx = { req, res };
            }
        };

        next();
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
