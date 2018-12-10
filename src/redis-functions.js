'use strict';

const {promisify} = require('util');
const redis = require('redis');
const surveys = redis.createClient()
surveys.getAsync = promisify(surveys.get).bind(surveys);
surveys.keysAsync = promisify(surveys.keys).bind(surveys);

surveys.on('connect', function() {
    console.log('Redis client surveys connected');
});

surveys.on('error', function (err) {
    console.log('Something went wrong with redis client surveys ' + err);
});

async function getAllSurveys() {
    let surveys = {};
    let keys = await surveys.keysAsync('*');
    if (keys) {
        for (let i = 0; i < keys.length; i++) {
            let survey = await surveys.getAsync(keys[i])
            surveys[keys[i]] = await JSON.parse(survey);
        }
    }
    return surveys;
}

module.exports = {
    surveys : surveys,
    getAllSurveys : getAllSurveys
};