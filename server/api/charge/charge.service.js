'use strict'

var config = require('../../config/environment')
var paymentAdapter = require(config.payment.adapter)

function getChargesList (connectAccountId, cb) {
  paymentAdapter.getChargesList(connectAccountId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

module.exports = {
  getChargesList: getChargesList
}
