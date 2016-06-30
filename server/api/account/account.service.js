'use strict'

var config = require('../../config/environment')
var paymentAdapter = require(config.payment.adapter)

function retrieveAccount (connectAccountId, cb) {
  paymentAdapter.retrieveAccount(connectAccountId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

module.exports = {
  retrieveAccount: retrieveAccount
}
