'use strict'

var balanceService = require('./balance.service.js')
var handleError = require('../../components/errors/handle.error').handleError

function getBalance (req, res) {
  if (!req.params || !req.params.connectAccountId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'connectAccount Id is required'
    })
  }
  balanceService.getBalance(req.params.connectAccountId, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    data.data = data.data.filter((obj) => {
      // console.log('obj', obj.status)
      // console.log('obj', obj.sourced_transfers.data.length)
      // console.log('obj', obj.status)
      // console.log('obj', obj.amount)
      // return obj.sourced_transfers.data > 0
      // https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
      obj.created = new Date(obj.created * 1000)
      // obj.destination === req.params.connectAccountId &&
      // return obj.status === 'available'
      return obj
    })
    // console.log('data', data)
    return res.status(200).json(data)
  })
}

module.exports = {
  getBalance: getBalance
}
