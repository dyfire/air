const App = require('./index');
const Router = require('./middleware/router');
const db = require('./middleware/mysql');
const config = require('./config/db.json');
const contentParse = require('./middleware/content-parse');
const fs = require('fs');

const app = new App();
app.use(contentParse());
app.use(db.bind(config));

const router = new Router();
router.get('/user', async (ctx) => {
  let html = fs.readFileSync('index.html');

  ctx.body = html;
});

router.post('/user', async (ctx) => {
  let name = ctx.post.name;
  ctx.body = "ok" + name;
});

router.get('/list', async (ctx) => {
  let rs = await ctx.mysql.query('select * from t_account');
  console.log(rs[0]);
  ctx.body = 'list';
});

router.get('/user/:id', async (ctx) => {
  ctx.body = ctx.param.id;
})

app.use(async (ctx, next) => {
  console.log('middleware');
  await next();
})
app.use(router.register());

app.listen(8010);
