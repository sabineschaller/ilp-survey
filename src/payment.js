'use strict';

const ilp = require('ilp');
const spsp = require('ilp-protocol-spsp');
const debug = require('debug')('ilp-spsp');

function pay(recipient, amount) {
    console.log(recipient, amount);
    try {
        const plugin = ilp.createPlugin()
        debug('connecting plugin')
        plugin.connect()

        debug('sending payment')
        spsp.pay(plugin, {
            receiver: recipient,
            sourceAmount: amount
        })
        console.log('sent!')
        return true;

    } catch (e) {
        console.error(e)
        return false;
    }
}

module.exports = {
    pay: pay
};