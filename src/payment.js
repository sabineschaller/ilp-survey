'use strict';

const ilp = require('ilp');
const spsp = require('ilp-protocol-spsp');
const request = require('request');
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

async function send(id, recipient, amount) {
    let amountDrops = helpers.XRPToDrops(amount);
    console.log(recipient, amountDrops);

    let response = await post(
        'http://ilpsurvey.localtunnel.me/' + id.substr(1),
        {
            'auth': {
                'bearer': 'test'
            },
            'form': {
                'amount': amountDrops, 
                'pointer': recipient
            }
        }
    )

    if (response) {
        console.log('sent!')
        return true;
    } else {
        return false;
    }
}

function post(url, parameter) {
    return new Promise(function (resolve, reject) {
        request.post(url, parameter, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve();
            } else {
                reject(error);
            }
        });
    });
}

module.exports = {
    pay: pay,
    send: send
};