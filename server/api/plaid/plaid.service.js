'use strict'

const config = require('../../config/environment')
const plaid = require('plaid')
const plaidClient = new plaid.Client(config.payment.plaid.clientId, config.payment.plaid.secret, plaid.environments[config.payment.plaid.env])

function authenticate (data, cb) {
  plaidClient.exchangeToken(data.publicToken, data.metadata.account_id, function (err, resExchangeToken) {
    if (err) return cb(err)
    return cb(null, resExchangeToken)
  })
}

module.exports = {
  authenticate: authenticate
}
