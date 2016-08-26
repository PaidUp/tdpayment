'use strict'

var chargeService = require('./charge.service.js')
var handleError = require('../../components/errors/handle.error').handleError

function getChargesList (req, res) {
  if (!req.params || !req.params.connectAccountId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'connectAccount Id is required'
    })
  }
  chargeService.getChargesList(req.params.connectAccountId, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    // console.log('obj charge', data.data[0])
    data.data = data.data.filter((obj) => {
      // console.log('obj charge', obj.status)
      // console.log('obj charge', obj.destination)
      // https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
      obj.created = new Date(obj.created * 1000)
      // return obj.destination === req.params.connectAccountId // && obj.status === 'succeeded'
      return obj
    })
    return res.status(200).json(data)
  })
};

function getDepositCharge (req, res) {
  if (!req.params || !req.params.paymentId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'paymentId Id is required'
    })
  }
  chargeService.getDepositCharge(req.params.paymentId, req.params.accountId, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
};

function getDepositChargeRefund (req, res) {
  if (!req.params || !req.params.paymentId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'paymentId Id is required'
    })
  }
  chargeService.getDepositChargeRefund(req.params.paymentId, req.params.accountId, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
};

module.exports = {
  getChargesList: getChargesList,
  getDepositCharge: getDepositCharge,
  getDepositChargeRefund: getDepositChargeRefund
}
