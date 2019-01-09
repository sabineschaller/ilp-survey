const path = require('path');
const Koa = require('koa');
const render = require('koa-ejs');
const serve = require('koa-static');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const auth = require('koa-basic-auth');
const demographics = require('./src/demographics');
const question = require('./src/question');
const pointerCheck = require('./src/check-pointer');
const creation = require('./src/creation');
const redis = require('./src/redis-functions');
const activation = require('./src/activation');
const answers = require('./src/answers');
const payment = require('./src/payment');

const credentials = { name: 'admin', pass: 'admin123' }

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
    let surveys = await redis.getAllSurveys();
    await ctx.render('overview', { surveys: surveys });
    ctx.status = 301;
});

router.get('/survey/:id', async ctx => {
    let survey = await redis.getOneSurvey(ctx.params.id);
    await ctx.render('welcome', { name: survey.name.toUpperCase(), pointer: '', balance: 0, error: '' });
    ctx.status = 301;
});

router.get('/create', async ctx => {
    await ctx.render('create', { error: '' });
    ctx.status = 301;
});

router.get('/answers', async ctx => {
    await ctx.render('answers', { error: '' });
    ctx.status = 301;
});

router.post('/survey/:id', async ctx => {
    let survey = await redis.getOneSurvey(ctx.params.id);
    let total = Object.keys(survey.questions).length;
    if (ctx.request.body['form-origin'] === 'welcome') {
        if (survey.codes.includes(ctx.request.body.pc)) {
            let answers = await redis.getOneSurvey('a' + ctx.params.id.substr(1));
            if (!Object.keys(answers).includes(ctx.request.body.pc)) {
                let check = await pointerCheck.process(ctx.request.body);
                if (check) {
                    await ctx.render('demographics', { pointer: ctx.request.body.pp, balance: 0 });
                } else {
                    await ctx.render('welcome', { name: survey.name.toUpperCase(), pointer: '', balance: 0, error: 'We were not able to verify your account. Please check whether you misspelled your payment pointer.' });
                }
            } else {
                await ctx.render('welcome', { name: survey.name.toUpperCase(), pointer: '', balance: 0, error: 'Your participation code has been used before. Please use another one.' });
            }
        } else {
            await ctx.render('welcome', { name: survey.name.toUpperCase(), pointer: '', balance: 0, error: 'Sorry, we could not find your participation code. Please try again.' });
        }
    }

    else if (ctx.request.body['form-origin'] === 'demographics') {
        let balance = await demographics.process(ctx.params.id, survey.price, ctx.request.body);
        await ctx.render('instructions', { instruction: survey.instruction, pointer: ctx.request.body.pp, balance: balance.toFixed(2) });
    }

    else if (ctx.request.body['form-origin'] === 'instructions') {
        await ctx.render('question', { question: survey.questions.q1, options: survey.options.o1, total: total, n: 1, pointer: ctx.request.body.pp, balance: ctx.request.body.balance });
    }

    else if (ctx.request.body['form-origin'] === 'question') {
        let n = await ctx.request.body.n;
        let balance = await question.process(ctx.params.id, n, survey.price, ctx.request.body);
        if (n < total) {
            await n++;
            await ctx.render('question', { question: survey.questions['q' + n], options: survey.options['o' + n], total: total, n: n, pointer: ctx.request.body.pp, balance: balance.toFixed(2) });
        } else {
            await payment.send(ctx.params.id, ctx.request.body.pp, Number(ctx.request.body.balance) + survey.price);
            await ctx.render('thanks', { pointer: ctx.request.body.pp, balance: balance.toFixed(2) });
        }
    }
});

router.post('/create', async ctx => {
    let surveyObject = await creation.process(ctx.request.body);
    if (surveyObject === {}) {
        await ctx.render('create', { error: 'A survey with that name already exists. Please choose another name.' });
    } else {
        await ctx.render('invitecodes', { codes: surveyObject.survey.codes, deposit: surveyObject.survey.deposit, id: surveyObject.id });
    }
});

router.post('/activate', ctx => {
    activation.process(ctx.request.body);
})

router.post('/answers', async ctx => {
    let survey = await redis.getOneSurvey('s' + ctx.request.body['survey-id']);
    let result = await answers.process(ctx.request.body);
    if (result === {}) {
        await ctx.render('answers', { error: 'We could not find any surveys matching these criteria.' })
    } else {
        await ctx.render('results', { survey: survey, result: JSON.parse(result) });
    }
});

app.use(router.routes());
app.listen(3000, function () {
    console.log('Server running on https://localhost:3000')
});