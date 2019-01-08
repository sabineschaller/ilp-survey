'use strict';

const hat = require('hat');
const request = require('request');
const crypto = require('crypto');
const helpers = require('./helpers');
const redis = require('./redis-functions');

async function process(obj) {
    let surveyObject = await createSurveyObject(obj);
    let response = await post(
        'http://ilpsurvey.localtunnel.me/',
        {
            'auth': {
                'bearer': 'test'
            },
            'form': {
                'maximum': helpers.XRPToDrops(surveyObject.survey.deposit),
                'name': surveyObject.survey.name,
                'webhook': 'http://localhost:3000/activate'
            }
        }
    )
    if (response) {
        surveyObject['id'] = await response.receiver.split('/')[1]
        await redis.surveys.set('s' + surveyObject.id, JSON.stringify(surveyObject.survey));
        await redis.surveys.set('a' + surveyObject.id, JSON.stringify({}));
        return surveyObject;
    } else {
        return {}
    }
}

function post(url, parameter) {
    return new Promise(function (resolve, reject) {
        request.post(url, parameter, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                reject(error);
            }
        });
    });
}

function createSurveyObject(obj) {
    let questions = findValueByPrefix(obj, 'q');
    let options = findValueByPrefix(obj, 'o', true);
    let codes = generateInviteCodes(obj['survey-codes']);
    let deposit = (6 + Object.keys(questions).length) * obj['survey-price'] * codes.length;
    let output = {
        survey: {
            name: obj['survey-name'],
            instruction: obj['survey-instruction'],
            price: Number(obj['survey-price']),
            questions: questions,
            options: options,
            codes: codes,
            deposit: deposit,
            password: helpers.hashCode(obj['pw']),
            timestamp: Date.now()
        }
    }
    return output;
}

function generateInviteCodes(n) {
    let codes = [];
    for (let i = 0; i < n; i++) {
        codes.push(hat());
    }
    return codes;
}

function findValueByPrefix(object, prefix, split = false) {
    let filteredElements = {};
    for (let property in object) {
        if (object.hasOwnProperty(property) &&
            property.toString().startsWith(prefix)) {
            if (split === true) {
                filteredElements[property] = object[property].split(',').map(item => item.trim());
            } else {
                filteredElements[property] = object[property];
            }
        }
    }
    return filteredElements;
}

module.exports = {
    process: process
};