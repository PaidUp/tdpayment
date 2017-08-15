'use strict'

const config = require('../../config/environment')
const plaid = require('plaid')
const plaidClient = new plaid.Client(config.payment.plaid.clientId, config.payment.plaid.secret, config.payment.plaid.publicKey, plaid.environments[config.payment.plaid.env])

function authenticate(data, cb) {
  plaidClient.exchangePublicToken(data.publicToken, function (err, resExchangeToken) {
    if (err) return cb(err)
    plaidClient.createStripeToken(resExchangeToken.access_token, data.metadata.account_id, function (err1, sToken) {
      return cb(null, sToken)

    });
  })
}

module.exports = {
  authenticate: authenticate
}
