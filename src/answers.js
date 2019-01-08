'use strict';

const redis = require('./redis-functions');
const helpers = require('./helpers');

async function process(obj) {
    let survey = await redis.getOneSurvey('s' + obj['survey-id']);
    if (survey.password !== helpers.hashCode(obj.pw)) {
        return {};
    } else {
        return await redis.surveys.getAsync('a' + obj['survey-id']);
    }
}

module.exports = {
    process: process
}