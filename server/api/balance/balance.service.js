'use strict'

var config = require('../../config/environment')
var paymentAdapter = require(config.payment.adapter)

function getBalance (connectAccountId, cb) {
  paymentAdapter.getBalance(connectAccountId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

module.exports = {
  getBalance: getBalance
}
