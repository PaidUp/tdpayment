'use strict'

var plaidService = require('./plaid.service.js')
var handleError = require('../../components/errors/handle.error').handleError

function authenticate (req, res) {
  if (!req.body || !req.body.publicToken) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'public_token is required'
    })
  }
  plaidService.authenticate(req.body, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

module.exports = {
  authenticate: authenticate
}
