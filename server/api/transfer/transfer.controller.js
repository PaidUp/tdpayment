'use strict'

var transferService = require('./transfer.service.js')
var handleError = require('../../components/errors/handle.error').handleError
var urlencode = require('urlencode');

function getTransfers (req, res) {
  if (!req.params || !req.params.destinationId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Destination Id is required'
    })
  }
  transferService.getTransfers(req.params.destinationId, urlencode.decode(req.params.from), urlencode.decode(req.params.to), function (err, data) {
    if (err) {
      console.log(err)
      return handleError(res, err)
    }
    data.data = data.data.filter((obj) => {
      // console.log('obj', obj)
      // console.log('obj transfer', obj.status)
      // console.log('obj trasnfer', obj.destination)
      // https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
      obj.created = new Date(obj.created * 1000)
      obj.date = new Date(obj.date * 1000)
      return obj
      // return obj.destination === req.params.connectAccountId // && obj.status === 'succeeded'
    })
    return res.status(200).json(data)
  })
}

function retrieveTransfer (req, res) {
  if (!req.params || !req.params.transferId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'transferId is required'
    })
  }
  transferService.retrieveTransfer(req.params.transferId, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

module.exports = {
  getTransfers: getTransfers,
  retrieveTransfer: retrieveTransfer
}
