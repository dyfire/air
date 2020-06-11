const App = require('./index');
const router = require('./middleware/router');

const app = new App();
app.use(router);
app.listen(8010);
