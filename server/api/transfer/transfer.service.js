'use strict'

var config = require('../../config/environment')
var paymentAdapter = require(config.payment.adapter)

function getTransfers (filter, cb) {
  paymentAdapter.getTransfers(filter, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function retrieveTransfer (transferId, cb) {
  console.log(transferId)
  paymentAdapter.retrieveTransfer(transferId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

module.exports = {
  getTransfers: getTransfers,
  retrieveTransfer: retrieveTransfer
}
