const Koa = require('koa');
const path = require('path');
const render = require('koa-ejs');
const open = require('open');
const app = new Koa();

render(app, {
  root: path.join(__dirname, '../public'),
  layout: false,
  viewExt: 'ejs',
});

function report(name, dep, inDep, outDep, S, score) {
  app.use(async function (ctx) {
    await ctx.render('index', {
      name,
      dep,
      inDep,
      outDep,
      S,
      score,
    });
  });
  app.listen(3000);
  app.on('error', function (err) {
    console.log(err.stack);
  });
  open('http://localhost:3000');
  console.log('启动成功了，打开 http://localhost:3000');
}

module.exports.report = report;
