'use strict';

const ilp = require('ilp');
const spsp = require('ilp-protocol-spsp');
const debug = require('debug')('ilp-spsp');
const helpers = require('./helpers');

async function pay(recipient, amount) {
    let amountDrops = helpers.XRPToDrops(amount);
    console.log(recipient, amountDrops);
    try {
        const plugin = ilp.createPlugin()
        debug('connecting plugin')
        await plugin.connect()

        debug('sending payment')
        await spsp.pay(plugin, {
            receiver: recipient,
            sourceAmount: amountDrops
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