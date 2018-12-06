'use strict';

const payment = require('./payment');
const helpers = require('./helpers');

async function process(obj) {
    let paymentWorks = await payment.pay(obj.pp, 0);
    return paymentWorks;
}

module.exports = {
    process: process
};