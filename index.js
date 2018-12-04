const Koa = require('koa');
const router = require('koa-router')();
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const app = new Koa();

app.use(serve(path.resolve(__dirname, 'static')));

router.get('/', ctx => {
    ctx.redirect('/welcome.html');
    ctx.status = 301;
  });

app.use(bodyParser());

router.post('/welcome.html', ctx => {
    console.log(ctx.request.body);
    ctx.redirect('/demographics.html');
});

router.post('/demographics.html', ctx => {
    console.log(ctx.request.body);
    ctx.redirect('/instructions.html');
});

router.post('/question.html', ctx => {
    console.log(ctx.request.body);
    ctx.redirect('/thanks.html');
});

app.use(router.routes());
app.listen(3000, function () {
    console.log('Server running on https://localhost:3000')
});