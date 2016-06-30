'use strict'

const config = require('../../config/environment')
const plaid = require('plaid')
const plaidClient = new plaid.Client(config.payment.plaid.clientId, config.payment.plaid.secret, plaid.environments.tartan)

function authenticate (data, cb) {
  const publicToken = data.publicToken
  plaidClient.exchangeToken(publicToken, function (err, resExchangeToken) {
    if (err) return cb(err)
    // This is your Plaid access token - store somewhere persistent
    // The access_token can be used to make Plaid API calls to
    // retrieve accounts and transactions
    const accessToken = resExchangeToken.access_token
    plaidClient.getAuthUser(accessToken, function (err, resGetAuthUser) {
      if (err) return cb(err)
      // An array of accounts for this user, containing account
      // names, balances, and account and routing numbers.
      const accounts = resGetAuthUser.accounts
      return cb(null, {accounts: accounts})
    })
  })
}

module.exports = {
  authenticate: authenticate
}
