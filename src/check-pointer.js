'use strict';

const payment = require('./payment');
const helpers = require('./helpers');

async function process(obj) {
    let paymentWorks = await payment.pay(obj.pp, 100);
    if ( paymentWorks === true){
        return helpers.dropsToXRP(100);
    } else {
        return 0;
    }
}

module.exports = {
    process: process
};