'use strict';

var webhookService = require('./webhook.service.js');
var handleError = require('../../components/errors/handle.error').handleError;

function wone (req, res) {
  if (!req.body || !req.body.id) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Id is required"
    });
  }
  return res.status(200).json(req.body);
};

exports.wone = wone;
