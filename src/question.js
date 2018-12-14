'use strict';

const payment = require('./payment');
const helpers = require('./helpers');
const redis = require('./redis-functions');

async function process(id, n, price, obj) {
    await storeAnswer(id, n, obj);
    await payment.pay(obj.pp, helpers.XRPToDrops(price));
    return Number(obj.balance) + price;
}

async function storeAnswer(id, n, obj) {
    let surveyAnswers = await redis.getOneSurvey('a' + id.substr(1));
    let answerId = helpers.hashCode(obj.pc);
    surveyAnswers[answerId]['q' + n] = obj.options;
    redis.surveys.set('a' + id.substr(1), JSON.stringify(surveyAnswers));
}

module.exports = {
    process: process
};