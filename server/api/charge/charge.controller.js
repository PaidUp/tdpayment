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
    data.data = data.data.filter((obj) => {
      // https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
      obj.created = new Date(obj.created * 1000)
      return obj.destination === req.params.connectAccountId
    })
    return res.status(200).json(data)
  })
}

module.exports = {
  getChargesList: getChargesList
}
