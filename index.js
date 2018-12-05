const path = require('path');
const Koa = require('koa');
const render = require('koa-ejs');
const serve = require('koa-static');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const demographics = require('./src/demographics');
const question = require('./src/question');

const app = new Koa();

app.use(serve(path.resolve(__dirname, 'static')));
app.use(bodyParser());

render(app, {
  root: path.join(__dirname, 'static'),
  layout: false,
  viewExt: 'html',
  cache: false,
  debug: false
});

router.get('/', async ctx => {
    await ctx.render('welcome');
    ctx.status = 301;
});

router.post('/', async ctx => {

    if (ctx.request.body['form-origin'] === 'welcome'){
        await ctx.render('demographics');
    } 
    
    else if (ctx.request.body['form-origin'] === 'demographics') {
        if (demographics.process(ctx.request.body) === true) {
            await ctx.render('instructions');
        } else {
            await ctx.render('welcome');
        }
    }

    if (ctx.request.body['form-origin'] === 'instructions'){
        await ctx.render('question');
    } 

    else if (ctx.request.body['form-origin'] === 'question') {
        if (question.process(ctx.request.body) === true) {
            await ctx.render('thanks');
        } else {
            await ctx.render('welcome');
        }
    }
});

app.use(router.routes());
app.listen(3000, function () {
    console.log('Server running on https://localhost:3000')
});