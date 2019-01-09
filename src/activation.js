'use strict';

const redis = require('./redis-functions');

async function process(obj) {
    if (obj.balance === obj.maximum) {
        let id = obj.pointer.split('/')[1]
        let survey = await redis.getOneSurvey('s' + id);
        survey['active'] = true;
        redis.surveys.set('s' + id, JSON.stringify(survey));
    }
}

module.exports = {
    process: process
}