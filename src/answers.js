'use strict';

const redis = require('./redis-functions');

async function process(obj) {
    let survey = await redis.getOneSurvey('s' + obj['survey-id']);
    if (survey.pointer !== obj.pp) {
        return {};
    } else {
        return await redis.surveys.getAsync('a' + obj['survey-id']);
    }
}

module.exports = {
    process: process
}