'use strict';

const payment = require('./payment');

function process(obj) {
    return payment.pay(obj.pp, 100);
}

module.exports = {
    process: process
};