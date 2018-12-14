'use strict';

const { promisify } = require('util');
const redis = require('redis');
const surveys = redis.createClient();
surveys.getAsync = promisify(surveys.get).bind(surveys);
surveys.keysAsync = promisify(surveys.keys).bind(surveys);

surveys.on('connect', function () {
    console.log('Redis client surveys connected');
});

surveys.on('error', function (err) {
    console.log('Something went wrong with redis client surveys ' + err);
});

async function getAllSurveys() {
    let surveyObject = {};
    let keys = await surveys.keysAsync('s*');
    if (keys) {
        for (let i = 0; i < keys.length; i++) {
            let survey = await surveys.getAsync(keys[i]);
            surveyObject[keys[i]] = await JSON.parse(survey);
        }
    }
    return surveyObject;
}

async function getOneSurvey(id) {
    let survey = await surveys.getAsync(id);
    return JSON.parse(survey);
}

module.exports = {
    surveys: surveys,
    getAllSurveys: getAllSurveys,
    getOneSurvey: getOneSurvey
};