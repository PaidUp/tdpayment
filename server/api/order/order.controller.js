'use strict';

var orderService = require('./order.service.js');

function createOrder (req, res) {
  if (!req.body || !req.body.merchantCustomerId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Merchant Customer Id is required"
    });
  }
  if (!req.body || !req.body.description) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Description is required"
    });
  }
  orderService.createOrder(req.body.merchantCustomerId, req.body.description, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

function updateOrderDescription (req, res) {
  if (!req.body || !req.body.orderId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Order Id is required"
    });
  }
  if (!req.body || !req.body.description) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Description is required"
    });
  }
  orderService.updateOrderDescription(req.body.orderId, req.body.description, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

function fetchDebit (req, res) {
  if (!req.params || !req.params.debitId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Debit Id is required"
    });
  }

  orderService.fetchDebit(req.params.debitId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

function handleError(res, err) {

  console.log(err);
  var httpErrorCode = 500;
  var errors = [];

  if (err.name === "ValidationError") {
    httpErrorCode = 400;
  }

  return res.json(httpErrorCode, {
    code: err.name,
    message: err.message,
    errors: err.errors
  });
}

module.exports = {
  createOrder : createOrder,
  updateOrderDescription : updateOrderDescription,
  fetchDebit : fetchDebit
};
