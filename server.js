const App = require('./index');
const Router = require('./middleware/router');
const db = require('./middleware/mysql');
const config = require('./config/db.json');
const contentParse = require('./middleware/content-parse');

const app = new App();
app.use(db.bind(config));
app.use(contentParse());

const router = new Router();
router.get('/user', async (ctx) => {
  let html = `
      <h1>request post demo</h1>
      <form method="POST" action="/user">
        <p>userName</p>
        <input name="userName" /><br/>
        <p>nickName</p>
        <input name="nickName" /><br/>
        <p>email</p>
        <input name="email" /><br/>
        <p>content</p>
        <textarea name="content"></textarea>
        <button type="submit">submit</button>
      </form>`;

  ctx.body = html;
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