const App = require('./index');
const Router = require('./middleware/router');

const app = new App();
const router = new Router();
router.get('/user', async (ctx) => {
  console.log('ddd');
  ctx.body = 'hello world';
});

router.get('/list', async (ctx) => {

  ctx.body = 'list';
});

router.get('/user/:id', async (ctx) => {

  ctx.body = ctx.param.id;
})

app.use(router.register());

app.listen(8010);