'use strict';

var orderService = require('./order.service.js');
var handleError = require('../../components/errors/handle.error').handleError;

function createOrder (req, res) {
  if (!req.body || !req.body.merchantCustomerId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Merchant Customer Id is required"
    });
  }
  if (!req.body || !req.body.description) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Description is required"
    });
  }
  orderService.createOrder(req.body.merchantCustomerId, req.body.description, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(data);
  });
};

function updateOrderDescription (req, res) {
  if (!req.body || !req.body.orderId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Order Id is required"
    });
  }
  if (!req.body || !req.body.description) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Description is required"
    });
  }
  orderService.updateOrderDescription(req.body.orderId, req.body.description, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(data);
  });
};

function fetchDebit (req, res) {
  if (!req.params || !req.params.debitId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Debit Id is required"
    });
  }

  orderService.fetchDebit(req.params.debitId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(data);
  });
};

module.exports = {
  createOrder : createOrder,
  updateOrderDescription : updateOrderDescription,
  fetchDebit : fetchDebit
};
