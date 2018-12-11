'use strict';

const payment = require('./payment');
const helpers = require('./helpers');

function process(price, obj) {
    payment.pay(obj.pp, helpers.XRPToDrops(price));
    return Number(obj.balance) + price;
}

module.exports = {
    process: process
};