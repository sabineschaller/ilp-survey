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
const admin = require('./src/admin');
const answers = require('./src/answers');

const credentials = { name: 'admin', pass: 'admin123' }

const app = new Koa();

app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.body = err.message
        ctx.status = err.status || 500
    }
})


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

router.get('/activation', async ctx => {
    await ctx.render('activation', { error: '' });
    ctx.status = 301;
});

router.get('/admin', auth(credentials), async ctx => {
    await ctx.render('admin', { error: '' });
    ctx.status = 301;
});

router.get('/answers', auth(credentials), async ctx => {
    await ctx.render('answers', { error: '' });
    ctx.status = 301;
});

router.post('/survey/:id', async ctx => {
    let survey = await redis.getOneSurvey(ctx.params.id);
    let total = Object.keys(survey.questions).length;

    if (ctx.request.body['form-origin'] === 'welcome') {
        if (survey.codes.includes(ctx.request.body.pc)) {
            let check = await pointerCheck.process(ctx.request.body);
            if (check) {
                await ctx.render('demographics', { pointer: ctx.request.body.pp, balance: 0 });
            } else {
                await ctx.render('welcome', { name: survey.name.toUpperCase(), pointer: '', balance: 0, error: 'We were not able to verify your account. Please check whether you misspelled your payment pointer.' });
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
            await ctx.render('thanks', { pointer: ctx.request.body.pp, balance: balance.toFixed(2) });
        }
    }
});

router.post('/create', async ctx => {
    let check = await pointerCheck.process(ctx.request.body);
    if (check) {
        let surveyObject = await creation.process(ctx.request.body);
        if (surveyObject === {}) {
            await ctx.render('create', { error: 'A survey with that name already exists. Please choose another name.' });
        } else {
            await ctx.render('invitecodes', { codes: surveyObject.survey.codes, deposit: surveyObject.survey.deposit, id: surveyObject.id });
        }
    } else {
        await ctx.render('create', { error: 'We were not able to verify your account. Please check whether you misspelled your payment pointer.' });
    }
});

router.post('/activation', async ctx => {
    let check = await pointerCheck.process(ctx.request.body);
    if (check) {
        let survey = await redis.getOneSurvey('s' + ctx.request.body['survey-id']);
        if (survey === null) {
            await ctx.render('activation', { error: 'We could not find your survey. Please check whether your misspelled your survey ID.' });
        } else {
            if (ctx.request.body['pp'] === survey.pointer) {
                await ctx.render('deposit', { id: ctx.params.id, name: survey.name, deposit: survey.deposit });
            } else {
                await ctx.render('activation', { error: 'This is not the payment pointer you used to create the survey. Please use your original pointer.' });
            }
        }
    } else {
        await ctx.render('activation', { error: 'We were not able to verify your account. Please check whether you misspelled your payment pointer.' });
    }
});

router.post('/admin', async ctx => {
    result = await admin.process(ctx.request.body);
    if (result === 0) {
        await ctx.render('admin', { error: 'We could not find any surveys matching these criteria.' })
    } else if (result === 2) {
        await ctx.render('admin', { error: 'We found more than one survey matching these criteria.' })
    } else {
        await ctx.redirect('/');
    }
});

router.post('/answers', async ctx => {
    let survey = await redis.getOneSurvey('s' + ctx.request.body['survey-id']);
    console.log(survey)
    let result = await answers.process(ctx.request.body);
    if (result === {}) {
        await ctx.render('answers', { error: 'We could not find any surveys matching these criteria.' })
    } else {
        console.log(JSON.parse(result));
        console.log(Object.keys(JSON.parse(result)))
        await ctx.render('results', { survey: survey, result: JSON.parse(result) });
    }
});

app.use(router.routes());
app.listen(3000, function () {
    console.log('Server running on https://localhost:3000')
});