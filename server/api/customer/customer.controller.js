'use strict';

var customerService = require('./customer.service');
var handleError = require('../../components/errors/handle.error').handleError;

function createCustomer (req, res) {
  if (!req.body || !req.body.firstName) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "First name is required"
    });
  }
  if (!req.body || !req.body.lastName) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Last name is required"
    });
  }
  if (!req.body || !req.body.email) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Email is required"
    });
  }
  if (!req.body || !req.body.id) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Cs Id is required"
    });
  };
  customerService.createCustomer(req.body, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(data);
  });
};

function fetchCustomer (req, res) {
  if (!req.params || !req.params.customerId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "customerId is required"
    });
  }
  customerService.fetchCustomer(req.params.customerId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(data);
  });
};

function createConnectAccount (req, res) {
  if (!req.body || !req.body.email) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Email is required"
    });
  }
  if (!req.body.country) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Country is required"
    });
  }
  customerService.createConnectAccount(req.body, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(data);
  });
};

function addToSAccount (req, res) {
  if (!req.body || !req.body.ip) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "ip is required"
    });
  }
  if (!req.body.accountId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "accountId is required"
    });
  }
  customerService.addToSAccount(req.body, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(data);
  });
};

function addLegaInfoAccount (req, res) {
  if (!req.body || !req.body.firstName) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "firstName is required"
    });
  }
  if (!req.body.lastName) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "lastName is required"
    });
  }
  customerService.addLegaInfoAccount(req.body, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(data);
  });
};

function updateAccount (req, res) {
  customerService.updateAccount(req.body, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(data);
  });
};

function updateCustomer (req, res) {
  customerService.updateCustomer(req.body, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(data);
  });
};

module.exports = {
  createCustomer : createCustomer,
  createConnectAccount : createConnectAccount,
  addToSAccount : addToSAccount,
  addLegaInfoAccount : addLegaInfoAccount,
  updateAccount : updateAccount,
  updateCustomer : updateCustomer,
  fetchCustomer : fetchCustomer
};
