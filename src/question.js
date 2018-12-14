'use strict';

const helpers = require('./helpers');
const redis = require('./redis-functions');

function process(id, n, price, obj) {
    storeAnswer(id, n, obj);
    return Number(obj.balance) + price;
}

async function storeAnswer(id, n, obj) {
    let surveyAnswers = await redis.getOneSurvey('a' + id.substr(1));
    surveyAnswers[obj.pc]['q' + n] = obj.options;
    redis.surveys.set('a' + id.substr(1), JSON.stringify(surveyAnswers));
}

module.exports = {
    process: process
};