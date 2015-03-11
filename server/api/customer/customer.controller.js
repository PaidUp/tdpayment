'use strict';

var customerService = require('./customer.service');
var handleError = require('../../components/errors/handle.error').handleError;

function createCustomer (req, res) {
  console.log('res');
  console.log(res.body);
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
    console.log('err');
    console.log(err);
    console.log('data');
    console.log(data);
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

module.exports = {
  createCustomer : createCustomer
};
