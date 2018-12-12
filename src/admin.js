'use strict';

const redis = require('./redis-functions');

async function process(obj) {
    let surveys = await redis.getAllSurveys();
    let updateCandidates = await findCandidates(surveys, obj);
    if (Object.keys(updateCandidates).length === 0) {
        return 0;
    } else if (Object.keys(updateCandidates).length > 1) {
        return 2;
    } else {
        let id = await Object.keys(updateCandidates)[0]
        await redis.surveys.set(id, JSON.stringify(updateCandidates[id]));
        return 1;
    }
}

function findCandidates(surveys, obj) {
    let candidates = {};
    for (let id in surveys) {
        if (surveys[id].pointer === obj.pp) {
            if (surveys[id].deposit <= obj.amount) {
                if (surveys[id].active === undefined) {
                    let candidate = surveys[id];
                    candidate['active'] = true;
                    candidates[id] = candidate;
                }
            }
        }
    }
    return candidates;
}

module.exports = {
    process: process
}