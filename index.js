const Koa = require('koa');
const router = require('koa-router')();
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const demographics = require('./src/demographics');
const question = require('./src/question');
const app = new Koa();

app.use(serve(path.resolve(__dirname, 'static')));
app.use(bodyParser());

router.get('/', ctx => {
    ctx.redirect('/welcome.html');
    ctx.status = 301;
});

router.post('/welcome.html', ctx => {
    ctx.redirect('/demographics.html');
});

router.post('/demographics.html', ctx => {
    if (demographics.process(ctx.request.body) === true) {
        ctx.redirect('/instructions.html');
    } else {
        ctx.redirect('/welcome.html');
    }
});

router.post('/question.html', ctx => {
    if (question.process(ctx.request.body) === true) {
        ctx.redirect('/thanks.html');
    } else {
        ctx.redirect('/welcome.html');
    }
});

app.use(router.routes());
app.listen(3000, function () {
    console.log('Server running on https://localhost:3000')
});