'use strict';

const payment = require('./payment');
const helpers = require('./helpers');

function process(obj) {
    payment.pay(obj.pp, 100);
    return Number(obj.balance) + helpers.dropsToXRP(100);
}

module.exports = {
    process: process
};