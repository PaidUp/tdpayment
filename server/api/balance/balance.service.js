'use strict'

var config = require('../../config/environment')
var paymentAdapter = require(config.payment.adapter)

function getBalance (connectAccountId, transferId, cb) {
  paymentAdapter.getBalance(connectAccountId, transferId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

module.exports = {
  getBalance: getBalance
}
