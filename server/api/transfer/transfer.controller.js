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
    // console.log('obj transfer', data.data[0])
    data.transfers = data.data.filter((obj) => {
      // console.log('obj', obj)
      // console.log('obj transfer', obj.status)
      // console.log('obj trasnfer', obj.destination)
      // https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
      obj.created = new Date(obj.created * 1000)
      return obj.destination === req.params.connectAccountId // && obj.status === 'succeeded'
    })
    return res.status(200).json(data)
  })
}

module.exports = {
  getTransfers: getTransfers
}
