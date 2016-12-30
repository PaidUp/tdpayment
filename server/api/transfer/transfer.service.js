'use strict'

var config = require('../../config/environment')
var paymentAdapter = require(config.payment.adapter)

function getTransfers (stripeAccount, from, to, cb) {
  var filter = {
    limit: 1000,
    date: {
      gte: getTimeUnix(from, 0, 0),
      lte: getTimeUnix(to, 23, 59)
    }
  }

  paymentAdapter.getTransfers(stripeAccount, filter, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function getTimeUnix(stringDate, hours, minutes){
  let arrDt = stringDate.split('/')
  console.log('arrDt: ', arrDt)
  
  let month = parseInt(arrDt[0]) - 1;
  return Date.UTC(arrDt[2],month,arrDt[1],hours, minutes) / 1000
}

function retrieveTransfer (transferId, cb) {
  paymentAdapter.retrieveTransfer(transferId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

module.exports = {
  getTransfers: getTransfers,
  retrieveTransfer: retrieveTransfer
}
