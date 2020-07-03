const App = require('./index');
const Router = require('./middleware/router');
const db = require('./middleware/mysql');
const config = require('./config/db.json');

const app = new App();
app.use(db.bind(config));
const router = new Router();
router.get('/user', async (ctx) => {
  console.log('ddd');
  ctx.body = 'hello world';
});

router.get('/list', async (ctx) => {
  let rs = await ctx.mysql.query('select * from t_account');
  ctx.body = 'list';
});

router.get('/user/:id', async (ctx) => {
  ctx.body = ctx.param.id;
})

app.use(router.register());

app.listen(8010);