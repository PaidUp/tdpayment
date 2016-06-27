'use strict'

var transferService = require('./transfer.service.js')
var handleError = require('../../components/errors/handle.error').handleError

function getTransfers (req, res) {
  if (!req.params || !req.params.destinationId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Destination Id is required'
    })
  }
  transferService.getTransfers({destination: req.params.destinationId}, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data.data)
  })
}

module.exports = {
  getTransfers: getTransfers
}
