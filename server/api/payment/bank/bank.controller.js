'use strict';

var userService = require('../../user/user.service');
var paymentService = require('../payment.service');
var bankService = require('./bank.service');
var camelize = require('camelize');

//TODO
/*
 For every API validate if user have BPCustomerId.
 if user not have BPCustomerId use method Prepared User.
*/

exports.create = function (req, res) {
  if (!req.body || !req.body.bankId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Bank id is required"
    });
  }
  var bankId = req.body.bankId;
  var filter = {
    _id: req.user._id
  };
  userService.findOne(filter, function (err, dataUser) {
    if (err) {
      return handleError(res, err);
    }
    paymentService.prepareUser(dataUser, function (err, userPrepared) {
      if (!userPrepared.BPCustomerId) {
        return res.json(400, {
          "code": "ValidationError",
          "message": "User without BPCustomerId"
        });
      }
      paymentService.associateBank(userPrepared.BPCustomerId, bankId, function (err, dataAssociate) {
        if (err) {
          return handleError(res, err);
        }
        paymentService.createBankVerification(bankId, function (err, dataVerification) {
          if (err) {
            return handleError(res, err);
          }
          paymentService.setUserDefaultBank(dataUser, function (err, data) {
            if (err) {
              return handleError(res, err);
            }
            return res.json(200, {});
          });
        });
      });

    });
  });
};

exports.listBanks = function (req, res) {
  var filter = {
    _id: req.user._id
  };
  userService.findOne(filter, function (err, dataUser) {
    if (err) {
      return handleError(res, err);
    }

    paymentService.prepareUser(dataUser, function (err, userPrepared) {

      if (!userPrepared.BPCustomerId) {
        return res.json(400, {
          "code": "ValidationError",
          "message": "User without BPCustomerId"
        });
      }
      paymentService.listBanks(userPrepared.BPCustomerId, function (err, dataBanks) {

        if (err) {
          console.log(err);
        } else {
          if(dataBanks.bankAccounts.length === 0){
            userPrepared.payment = {};
            userService.save(userPrepared, function(err, userx){
              if(err){
                return res.json(500,err);
              }
            });
          }
          return res.json(200, camelize(dataBanks));
        }
      });
    });
  });
}

exports.verify = function (req, res) {
  var verificationId = req.body.verificationId;
  var deposit1 = req.body.deposit1;
  var deposit2 = req.body.deposit2;
  if (!verificationId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "VerificationId is required"
    });
  }
  bankService.verifyAmounts(deposit1, function (valid) {
    if (!valid) {
      return res.json(400, {
        "code": "ValidationError",
        "message": "Deposit1 is not valid"
      });
    }
  });
  bankService.verifyAmounts(deposit2, function (valid) {
    if (!valid) {
      return res.json(400, {
        "code": "ValidationError",
        "message": "Deposit2 is not valid"
      });
    }
  });
  var filter = {
    _id: req.user._id
  };
  userService.findOne(filter, function (err, dataUser) {
    if (err) {
      return handleError(res, err);
    }
    paymentService.prepareUser(dataUser, function (err, userPrepared) {
      if (!userPrepared.BPCustomerId) {
        return res.json(400, {
          "code": "ValidationError",
          "message": "User without BPCustomerId"
        });
      }
      paymentService.confirmBankVerification(verificationId, deposit1, deposit2, function (err, data) {
        if (err){
          paymentService.loadBankVerification(verificationId, function(err, bank){
            if(err){
              return handleError(res, err);
            }
            if(bank.bankAccountVerifications[0].attemptsRemaining <= 0){
              return res.json(400, {
                "code": "ValidationError",
                "message": "Has exceeded number max to attempts",
                "attemptsRemaining": bank.bankAccountVerifications[0].attemptsRemaining,
                "attempts": bank.bankAccountVerifications[0].attempts
              });
            }
            else{
              return res.json(400, {
                "code": "ValidationError",
                "message": "Your bank account has not been verified",
                "attemptsRemaining": bank.bankAccountVerifications[0].attemptsRemaining,
                "attempts": bank.bankAccountVerifications[0].attempts
              });
            }
          });
        } else {
          if (!data) {
            return res.json(400, {
              "code": "ValidationError",
              "message": "Your bank account has not been verified correctly",
              "attemptsRemaining": bank.bankAccountVerifications[0].attemptsRemaining,
              "attempts": bank.bankAccountVerifications[0].attempts
            });
          }
          var filter = {
            _id: req.user._id
          };
          userService.findOne(filter, function (err, dataUser) {
            paymentService.setUserDefaultBank(dataUser, function (err, data) {
              if (err) {
                return handleError(res, err);
              }
              return res.json(200, data);
            });
          });
        }
      });
    });
  });
}

exports.pending = function (req, res) {
  var filter = {
    _id: req.user._id
  };
  userService.findOne(filter, function (err, dataUser) {
    if (err) {
      return handleError(res, err);
    }
    paymentService.prepareUser(dataUser, function (err, userPrepared) {
      if (!userPrepared.BPCustomerId) {
        return res.json(400, {
          "code": "ValidationError",
          "message": "user without BPCustomerId"
        });
      }
      paymentService.listBanks(req.user.BPCustomerId, function (err, dataBanks) {
        if (err) {
          return res.json(400, {
            "code": "ValidationError",
            "message": "Error banks"
          });
        }
        if (!dataBanks) {
          return res.json(400, {
            "code": "ValidationError",
            "message": "user without Banks"
          });
        }

        dataBanks.forEach(function (bank) {

        });
      });
    });
  });
}

exports.getBank = function (req, res) {
  if (!req.params.id) {
    return res.json({
      "code": "ValidationError",
      "message": "Bank id is required"
    });
  }
  var filter = {
    _id: req.user._id
  };
  userService.findOne(filter, function (err, dataUser) {
    if (err) {
      return handleError(res, err);
    }
    paymentService.prepareUser(dataUser, function (err, userPrepared) {
      if (!userPrepared.BPCustomerId) {
        return res.json(400, {
          "code": "ValidationError",
          "message": "User without BPCustomerId"
        });
      }

      paymentService.fetchBank(req.params.id, function (err, dataBank) {
        if (err) {
          return res.json(400, {
            "code": "ValidationError",
            "message": "Bank is not valid"
          });
        }
        if (!dataBank) {
          return res.json(400, {
            "code": "ValidationError",
            "message": "User without Bank"
          });
        }
        return res.json(200, camelize(dataBank));
      });

    });
  });
}

exports.deleteBankAccount = function(req, res){
  paymentService.deleteBankAccount(req.params.customerId, req.params.bankId, function(err, data){
    if (err) {
      return res.json(400, {
        "code": "ValidationError",
        "message": "Bank is not valid"
      });
    }

    return res.json(200, {});

  });
}

function handleError(res, err) {
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
