'use strict';

const redisFunc = require('./redis-functions')

async function getAllSurveys() {
    let surveys = {};
    let keys = await redisFunc.surveys.keysAsync('*');
    if (keys) {
        for (let i = 0; i < keys.length; i++) {
            let survey = await redisFunc.surveys.getAsync(keys[i])
            surveys[keys[i]] = await JSON.parse(survey);
        }
    }
    return surveys;
}

module.exports = {
    getAllSurveys : getAllSurveys
}