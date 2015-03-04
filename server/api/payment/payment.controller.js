/**
 * Created by riclara on 3/2/15.
 */
'use strict';

var paymentService = require('./payment.service');
var camelize = require('camelize');

exports.createCustomer = function (req, res) {
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
  }

  paymentService.createCustomer(req.body, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.createCard = function (req, res) {
  if (!req.body || !req.body.number) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Card number id is required"
    });
  }
  if (!req.body || !req.body.expiration_year) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Expiration year is required"
    });
  }
  if (!req.body || !req.body.expiration_month) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Expiration month is required"
    });
  }
  paymentService.createCard(req.body, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.associateCard = function (req, res) {
  if (!req.body || !req.body.customerId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Customer id is required"
    });
  }
  if (!req.body || !req.body.cardId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Card id is required"
    });
  }
  paymentService.associateCard(req.body.customerId, req.body.cardId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.createBank = function (req, res) {
  if (!req.body || !req.body.name) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Name is required"
    });
  }
  if (!req.body || !req.body.account_number) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Account number is required"
    });
  }
  if (!req.body || !req.body.routing_number) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Routing number is required"
    });
  }
  paymentService.createBank(req.body, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.associateBank = function (req, res) {
  if (!req.body || !req.body.customerId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Customer id is required"
    });
  }
  if (!req.body || !req.body.bankId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Bank id is required"
    });
  }
  paymentService.associateBank(req.body.customerId, req.body.bankId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.createOrder = function (req, res) {
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
  paymentService.createOrder(req.body.merchantCustomerId, req.body.description, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.debitCard = function (req, res) {
  if (!req.body || !req.body.cardId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Card Id is required"
    });
  }
  if (!req.body || !req.body.amount) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "amount is required"
    });
  }

  if (!req.body || !req.body.description) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Description is required"
    });
  }

  if (!req.body || !req.body.appearsOnStatementAs) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "appearsOnStatementAs is required"
    });
  }

  if (!req.body || !req.body.orderId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Order Id is required"
    });
  }

  paymentService.debitCard(req.body.cardId, req.body.amount, req.body.description, req.body.appearsOnStatementAs, req.body.orderId,
    function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.debitBank = function (req, res) {
  if (!req.body || !req.body.bankId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Bank Id is required"
    });
  }
  if (!req.body || !req.body.amount) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Amount is required"
    });
  }

  if (!req.body || !req.body.description) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Description is required"
    });
  }

  if (!req.body || !req.body.appearsOnStatementAs) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "AppearsOnStatementAs is required"
    });
  }

  if (!req.body || !req.body.orderId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Order Id is required"
    });
  }

  paymentService.debitBank(req.body.bankId, req.body.amount, req.body.description, req.body.appearsOnStatementAs, req.body.orderId,
    function(err, data){
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, data);
    });
};

exports.listCustomerBanks = function (req, res) {
  if (!req.params || !req.params.customerId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Customer Id is required"
    });
  }
  paymentService.listCustomerBanks(req.params.customerId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.listCards = function (req, res) {
  if (!req.params || !req.params.customerId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Customer Id is required"
    });
  }
  paymentService.listCards(req.params.customerId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.createBankVerification = function (req, res) {
  if (!req.body || !req.body.bankId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Bank Id is required"
    });
  }
  paymentService.createBankVerification(req.body.bankId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.loadBankVerification = function (req, res) {
  if (!req.params || !req.params.verificationId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Verification Id is required"
    });
  }
  paymentService.loadBankVerification(req.params.verificationId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.deleteBankAccount = function (req, res) {
  if (!req.body || !req.body.bankId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Bank Id is required"
    });
  }
  paymentService.deleteBankAccount(req.body.bankId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.confirmBankVerification = function (req, res) {
  if (!req.body || !req.body.verificationId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Verification Id is required"
    });
  }
  if (!req.body || !req.body.amount1) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Amount 1 is required"
    });
  }
  if (!req.body || !req.body.amount2) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Amount 2 is required"
    });
  }
  paymentService.confirmBankVerification(req.body.verificationId, req.body.amount1, req.body.amount2, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.updateOrderDescription = function (req, res) {
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
  paymentService.updateOrderDescription(req.body.orderId, req.body.description, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.listBanks = function (req, res) {
  if (!req.params || !req.params.customerId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Customer Id is required"
    });
  }

  paymentService.listBanks(req.params.customerId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.prepareCard = function (req, res) {
  if (!req.body || !req.body.userId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "User Id is required"
    });
  }
  if (!req.body || !req.body.cardId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Card Id is required"
    });
  }
  paymentService.prepareCard(req.body.userId, req.body.cardId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.prepareBank = function (req, res) {
  if (!req.body || !req.body.userId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "User Id is required"
    });
  }
  if (!req.body || !req.body.bankId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Bank Id is required"
    });
  }
  paymentService.prepareBank(req.body.userId, req.body.bankId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.fetchBank = function (req, res) {
  if (!req.params || !req.params.bankId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Bank Id is required"
    });
  }

  paymentService.fetchBank(req.params.bankId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.fetchCard = function (req, res) {
  if (!req.params || !req.params.cardId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Card Id is required"
    });
  }

  paymentService.fetchCard(req.params.cardId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.fetchDebit = function (req, res) {
  if (!req.body || !req.body.debitId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Debit Id is required"
    });
  }

  paymentService.fetchDebit(req.body.debitId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.getUserDefaultBankId = function (req, res) {
  if (!req.params || !req.params.customerId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "User is required"
    });
  }

  paymentService.getUserDefaultBankId(req.params.customerId, function(err, data){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
};

exports.getUserDefaultCardId = function (req, res) {
  if (!req.params || !req.params.customerId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "User is required"
    });
  }

  paymentService.getUserDefaultCardId(req.params.customerId, function(err, data){
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
