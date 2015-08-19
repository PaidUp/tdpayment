'use strict';

var customerService = require('./customer.service');
var handleError = require('../../components/errors/handle.error').handleError;

function createCustomer (req, res) {
  if (!req.body || !req.body.firstName) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "First name is required"
    });
  }
  if (!req.body || !req.body.lastName) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Last name is required"
    });
  }
  if (!req.body || !req.body.email) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Email is required"
    });
  }
  if (!req.body || !req.body.id) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Cs Id is required"
    });
  };
  customerService.createCustomer(req.body, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

function createConnectAccount (req, res) {
  if (!req.body || !req.body.email) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Email is required"
    });
  }
  if (!req.body.country) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Country is required"
    });
  }
  customerService.createConnectAccount(req.body, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

function addToSAccount (req, res) {
  if (!req.body || !req.body.ip) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "ip is required"
    });
  }
  if (!req.body.accountId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "accountId is required"
    });
  }
  customerService.addToSAccount(req.body, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

function addLegaInfoAccount (req, res) {
  if (!req.body || !req.body.firstName) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "firstName is required"
    });
  }
  if (!req.body.lastName) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "lastName is required"
    });
  }
  customerService.addLegaInfoAccount(req.body, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

function updateAccount (req, res) {
  customerService.updateAccount(req.body, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

function updateCustomer (req, res) {
  customerService.updateCustomer(req.body, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};


module.exports = {
  createCustomer : createCustomer,
  createConnectAccount : createConnectAccount,
  addToSAccount : addToSAccount,
  addLegaInfoAccount : addLegaInfoAccount,
  updateAccount : updateAccount,
  updateCustomer : updateCustomer
};
