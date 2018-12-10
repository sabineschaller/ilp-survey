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

module.exports = {
    surveys : surveys,
};