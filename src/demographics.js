'use strict';

const payment = require('./payment');

function process(obj) {
    let declines = count(obj);
    let payout = computePayout(declines);
    return payment.pay(obj.pp, payout);
}

function count(obj) {
    let declines = 0;
    for (var key in obj) {
        if (obj[key] === 'decline'){
            declines ++;
        }
    }
    return declines;
}

function computePayout(declines) {
    return (6 - declines) * 100;
}

module.exports = {
    process: process
};