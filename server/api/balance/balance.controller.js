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
    return res.status(200).json(data)
  })
}

module.exports = {
  getBalance: getBalance
}
