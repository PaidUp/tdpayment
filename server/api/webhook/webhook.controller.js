'use strict';

var webhookService = require('./webhook.service.js');
var handleError = require('../../components/errors/handle.error').handleError;

function wone (req, res) {
  if (!req.body || !req.body.id) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Id is required"
    });
  }
  return res.json(200,req.body);
};

exports.wone = wone;