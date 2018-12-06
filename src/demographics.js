'use strict';

const payment = require('./payment');
const helpers = require('./helpers');

function process(obj) {
    let declines = count(obj);
    let payout = computePayout(declines);
    payment.pay(obj.pp, payout);
    return Number(obj.balance) + helpers.dropsToXRP(payout);
}

function count(obj) {
    let declines = 0;
    for (let key in obj) {
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