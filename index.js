const path = require('path');
const Koa = require('koa');
const render = require('koa-ejs');
const serve = require('koa-static');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const demographics = require('./src/demographics');
const question = require('./src/question');
const pointerCheck = require('./src/check-pointer');
const creation = require('./src/creation');

const app = new Koa();

app.use(serve(path.resolve(__dirname, 'static')));
app.use(bodyParser());

render(app, {
  root: path.join(__dirname, 'static'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: false
});

router.get('/', async ctx => {
    await ctx.render('welcome', {pointer: '', balance: 0, error: ''});
    ctx.status = 301;
});

router.get('/pointer', async ctx => {
    await ctx.render('pointer');
    ctx.status = 301;
});

router.get('/create', async ctx => {
    await ctx.render('create', {error : ''});
    ctx.status = 301;
});

router.post('/', async ctx => {

    if (ctx.request.body['form-origin'] === 'welcome'){
        let check = await pointerCheck.process(ctx.request.body);
        if (check) {
            await ctx.render('demographics', {pointer: ctx.request.body.pp, balance: 0});
        } else {
            await ctx.render('welcome', {pointer: '', balance: 0, error: 'We were not able to send the first 100 Drops to you. Please check whether you misspelled your payment pointer.'});
        }
    } 
    
    else if (ctx.request.body['form-origin'] === 'demographics') {
        let payout = demographics.process(ctx.request.body);
        await ctx.render('instructions', {pointer: ctx.request.body.pp, balance: payout.toFixed(4)});
    }

    if (ctx.request.body['form-origin'] === 'instructions'){
        await ctx.render('question', {pointer: ctx.request.body.pp, balance: ctx.request.body.balance});
    } 

    else if (ctx.request.body['form-origin'] === 'question') {
        let payout = question.process(ctx.request.body);
        await ctx.render('thanks', {pointer: ctx.request.body.pp, balance: payout.toFixed(4)});
    }
});

router.post('/pointer', async ctx => {
    await ctx.redirect('/');
});

router.post('/create', async ctx => {
    let codes = await creation.process(ctx.request.body);
    console.log(codes);
    if (codes === []) {
        await ctx.render('create', {error : 'A survey with that name already exists. Please choose another name.'});
    } else {
        await ctx.render('invitecodes', {codes : codes});
    }
});

app.use(router.routes());
app.listen(3000, function () {
    console.log('Server running on https://localhost:3000')
});