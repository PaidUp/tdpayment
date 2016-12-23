'use strict'

var config = require('../../config/environment')
var paymentAdapter = require(config.payment.adapter)

function getTransfers (stripeAccount, from, to, cb) {
  var dateFrom = new Date(from).toISOString().substring(0,10)
  var dateTo = new Date(to).toISOString().substring(0,10)

  var filter = {
    limit: 100000,
    date: {
      gte: new Date(dateFrom).getTime()/1000,
      lte: new Date(dateTo).getTime()/1000
    }
  }
  paymentAdapter.getTransfers(stripeAccount, filter, function (err, data) {
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
