'use strict';

const helpers = require('./helpers');
const redis = require('./redis-functions');

function process(id, price, obj) {
    storeAnswers(id, obj);
    let declines = count(obj);
    let payout = computePayout(price, declines);
    return Number(obj.balance) + helpers.dropsToXRP(payout);
}

function count(obj) {
    let declines = 0;
    for (let key in obj) {
        if (obj[key] === 'decline'){
            declines ++;
        }
    }
    return declines;
}

function computePayout(price, declines) {
    return (6 - declines) * helpers.XRPToDrops(price);
}

async function storeAnswers(id, obj) {
    let surveyAnswers = await redis.getOneSurvey('a' + id.substr(1));
    let demographics = {
        age: obj.age,
        race: obj.race,
        ethnicity: obj.ethnicity,
        sex: obj.sex,
        education: obj.education,
        nationality: obj.nationality
    }
    surveyAnswers[obj.pc] = demographics;
    redis.surveys.set('a' + id.substr(1), JSON.stringify(surveyAnswers));
}

module.exports = {
    process: process
};