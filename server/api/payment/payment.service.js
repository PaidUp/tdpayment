'use strict';

var mongoose = require('mongoose');
var config = require('../../config/environment');
var paymentAdapter = require('./payment.adapter');
var commerceAdapter = require('../commerce/commerce.adapter');
var userService = require('../user/user.service');
var mongoose = require('mongoose');
var logger = require('../../config/logger');
var async = require('async');
var camelize = require('camelize');
var paymentEmailService = require('./payment.email.service');

function createCustomer(user, cb) {

  var customer = {
    name: user.firstName + " " + user.lastName,
    email: user.email,
    meta: { csId: user.id}
  }
  paymentAdapter.createCustomer(customer, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function createCard(cardDetails, cb) {
  paymentAdapter.createCard(cardDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function associateCard(customerId, cardId, cb) {
  paymentAdapter.associateCard(customerId, cardId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function createBank(bankDetails, cb) {
  paymentAdapter.createBank(bankDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function associateBank(customerId, bankId, cb) {
  paymentAdapter.associateBank(customerId, bankId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function createOrder(merchantCustomerId, description, cb) {
  paymentAdapter.createOrder(merchantCustomerId, description, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function debitCard(cardId, amount, description, appearsOnStatementAs, orderId, cb) {
  paymentAdapter.debitCard(cardId, amount, description, appearsOnStatementAs, orderId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function debitBank(bankId, amount, description, appearsOnStatementAs, orderId, cb) {
  paymentAdapter.debitBank(bankId, amount, description, appearsOnStatementAs, orderId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function associateBank(customerId, bankId, cb) {
  paymentAdapter.associateBank(customerId, bankId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function listCustomerBanks(customerId, cb) {
  paymentAdapter.listCustomerBanks(customerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function listCards(customerId, cb) {
  paymentAdapter.listCards(customerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function createBankVerification(bankId, cb) {
  paymentAdapter.createBankVerification(bankId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function loadBankVerification(verificationId, cb) {
  paymentAdapter.loadBankVerification(verificationId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function deleteBankAccount(customerId, bankId, cb) {
  paymentAdapter.deleteBankAccount(bankId, function(err, data){
    if(err) return cb(err);
    listBanks(customerId, function(err, dataBanks){
      if(dataBanks.bankAccounts.length === 0){
        userService.findOne({BPCustomerId:customerId}, function(err, user){
          user.payment = {};
          userService.save(user, function(err, dataUpdateUser){
            if(err){
              return cb(err);
            }
          });
        });
      }
      return cb(null, data);
    });
  });
}

function confirmBankVerification(verificationId, amount1, amount2, cb) {
  paymentAdapter.confirmBankVerification(verificationId, amount1, amount2, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function updateOrderDescription(orderId, description, cb) {
  paymentAdapter.updateOrderDescription(orderId, description, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function collectPendingOrders(cb) {
  commerceAdapter.orderList({status: "pending"}, function(err, data) {
    var orderList = [];
    if (err) return cb(err);
    async.eachSeries(data, function (order, callback) {
      commerceAdapter.orderLoad(order.incrementId, function (err, data) {
        if (err) return cb(err);
        orderList.push(data);
        callback();
      });
    }, function (err) {
      if (err) {
        throw err;
      }
      return cb(null, orderList);
    });
  });
}

function createOrder(merchantId, description, cb) {
  var transactionData = {};

  paymentAdapter.fetchCustomer(merchantId, function (err, data) {
    if (err) return cb(err);
    paymentAdapter.createOrder(merchantId, description, function (err, data) {
      if (err) return cb(err);
      transactionData.order = data;
      var orderId = data.orders[0].id;
      return cb(null, orderId);
    });
  });
}

function listBanks (customerId, cb) {
  paymentAdapter.listBanks(customerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

/**
 * Prepare user for Balanced Payments
 * @param user
 * @param cb
 */
function prepareUser(user, cb) {
  if(! user.BPCustomerId) {
    createCustomer(user, function(err, data) {
      if (err) return cb(err);
      user.BPCustomerId = data.id;
      userService.save(user,function(err, data){
        if (err) return cb(err);
        return cb(null, data);
      });
    });
  }
  else {
    return cb(null, user);
  }
}

function prepareCard(userId, cardId, cb) {
  paymentAdapter.fetchCard(cardId, function(err, creditCard){
    if(err) return cb(err);
      if(creditCard.cards[0].links.customer === null) {
        associateCard(userId, cardId, function (err, data) {
          if(err) return cb(err);
          return cb(null, creditCard);
        });
    }
    else {
      return cb(null, creditCard);
    }
  });
}

function prepareBank(userId, bankId, cb) {
  paymentAdapter.fetchBank(bankId, function(err, bank){
    if(bank.bankAccounts[0].links.customer === null) {
      associateBank(userId, bankId, function (err, data) {
        if(err) return cb(err);
        return cb(null, bank);
      });
    }
    else {
      return cb(null, bank);
    }
  });
}

function fetchBank(bankId, cb){
  paymentAdapter.fetchBank(bankId, function(err, bank){
      if(err) return cb(err);
      return cb(null, bank);
  });
}

function fetchCard(cardId, cb){
  paymentAdapter.fetchCard(cardId, function(err, creditCard){
      if(err) return cb(err);
      return cb(null, creditCard);
  });
}

function fetchDebit(debitId, cb){
  paymentAdapter.fetchDebit(debitId, function(err, bank){
    if(err) return cb(err);
    return cb(null, bank);
  });
}

function debitOrderCreditCard(orderId, userId, merchantId, amount, cardId, cb) {
  // 2a) Prepare BP customer
  logger.info('2a) Prepare BP customer');
  userService.findOne({_id: userId}, function (err, user) {
    if(err) return cb(err);
    prepareUser(user, function (err, user) {
      if(err) return cb(err);
      logger.info('2b) Associate BP customer credit card');
      // 2b) Associate BP customer credit card
      prepareCard(user.BPCustomerId, cardId, function (err, cardDetails) {
        if(err) return cb(err);
        logger.info('2c) Create BP Order');
        // 2c) Create BP Order
        createOrder(merchantId, orderId, function(err, BPOrderId) {
          if(err) return cb(err);
          logger.info('2d) Report BP Order to Magento.');
          commerceAdapter.addCommentToOrder(orderId, JSON.stringify({BPOrderId: BPOrderId},null, 4), 'pending', function (err, result) {
            logger.info('2e) Debit BP credit card, order.');
            // 2d) Debit BP credit card
            debitCard(cardId, amount, "Magento: "+orderId, config.balanced.appearsOnStatementAs, BPOrderId, function(err, data) {
              if(err) return cb(err);
              if(data.debits[0].status == 'succeeded') {
                logger.info('2f) Create Magento transaction');
                // 2e) Create Magento transaction
                var result = {amount: amount, BPOrderId: BPOrderId, BPDebitId: data.debits[0].id,
                  paymentMethod: "creditcard", number: cardDetails.cards[0].number, brand : cardDetails.cards[0].brand};
                commerceAdapter.addTransactionToOrder(orderId, BPOrderId, result, function(err, data){
                  if(err) return cb(err);
                  return cb(null, result);
                });
              }
              else {
                // Debit failed
                return cb(data);
              }
            });
          });
        });
      });
    });
  });
}

function debitOrderDirectDebit(orderId, userId, merchantId, amount, bankId, cb) {
  // 2a) Prepare BP customer
  logger.info('2a) Prepare BP customer');
  userService.findOne({_id: userId}, function (err, user) {
    if(err) return cb(err);
    prepareUser(user, function (err, user) {
      if(err) return cb(err);
      logger.info('2b) Associate BP customer bank account');
      // 2b) Associate BP customer credit card
      prepareBank(user.BPCustomerId, bankId, function (err, bankDetails) {
        if(err) return cb(err);
        logger.info('2c) Create BP Order');
        // 2c) Create BP Order
        createOrder(merchantId, orderId, function(err, BPOrderId) {
          if(err) return cb(err);
          logger.info('2d) Report BP Order to Magento.');
          commerceAdapter.addCommentToOrder(orderId, JSON.stringify({BPOrderId: BPOrderId},null, 4), 'pending', function (err, result) {
            if (err) return cb(err);
            logger.info('2e) Debit BP bank account, order.');
            // 2d) Debit BP credit card
            debitBank(bankId, amount, "Magento: "+orderId, config.balanced.appearsOnStatementAs, BPOrderId, function(err, data) {
              if(err) return cb(err);
              if(data.debits[0].status == 'succeeded') {
                logger.info('2f) Create Magento transaction');
                // 2e) Create Magento transaction
                var result = {amount: amount, BPOrderId: BPOrderId, BPDebitId: data.debits[0].id,
                  paymentMethod: "directdebit", account: bankDetails.bankAccounts[0].accountNumber,
                  bankName: bankDetails.bankAccounts[0].bankName, accountType: bankDetails.bankAccounts[0].accountType};
                commerceAdapter.addTransactionToOrder(orderId, BPOrderId, result, function(err, data){
                  if(err) return cb(err);
                  return cb(null, result);
                });
              }
              else {
                // Debit failed
                return cb(data);
              }
            });
          });
        });
      });
    });
  });
}

function capture(order, user, BPCustomerId, amount, paymentMethod, cb) {
  logger.info('1) paymentService > Processing ' + order.incrementId);

  if(paymentMethod == "creditcard") {
    var paymentId = order.cardId;
    debitOrderCreditCard(order.incrementId, user.id, BPCustomerId, amount, paymentId, function (err, resultDebit) {
      // Debit failed
      if (err) {
        logger.info('Failed, add a comment and mark order as "on hold"');
        // 3) Add a comment and mark order as "processing"
        commerceAdapter.addCommentToOrder(order.incrementId, "Capture failed: " + JSON.stringify(err,null, 4), null, function (subErr, result) {
          commerceAdapter.orderHold(order.incrementId, function(err, data){
            //TODO
            paymentEmailService.sendFinalEmailCreditCard(user, amount, order.incrementId, function(error, data){
              logger.log('info', 'send email final email ' + data );
            });

            return cb(err);
          });
        });
      }
      else {
        // Debit succeed
        logger.info('3) Success, add a comment and mark order as "processing"');
        // 3) Add a comment and mark order as "processing"
        commerceAdapter.addCommentToOrder(order.incrementId, "Capture succeed, transaction: " + resultDebit.BPOrderId, 'processing', function (err, result) {
          if (err) return cb(err);
          //TODO
          paymentEmailService.sendProcessedEmailCreditCard(user, amount, resultDebit.number, order.incrementId, function(err, data){
            logger.log('info', 'send processed email. ' + data );
          });

          return cb(null, resultDebit.BPOrderId);
        });
      }
    });
  }
  else if(paymentMethod == "directdebit") {
    getUserDefaultBankId(user, function(defaultBankError, paymentId){
      if(defaultBankError) {
        logger.info('Failed, add a comment and mark order as "on hold"');
        // 3) Add a comment and mark order as "processing"
        commerceAdapter.addCommentToOrder(order.incrementId, defaultBankError.name, null, function (err, result) {
          commerceAdapter.orderHold(order.incrementId, function(err, data){
            return cb(defaultBankError);
          });
        });
      }
      else {
        // Debit order
        debitOrderDirectDebit(order.incrementId, user.id, BPCustomerId, amount, paymentId, function (err, resultDebit) {
          // Debit failed
          if (err) {
            logger.info('Failed, add a comment and mark order as "on hold"');
            // 3) Add a comment and mark order as "processing"
            commerceAdapter.addCommentToOrder(order.incrementId, "Capture failed: " + JSON.stringify(err,null, 4), null, function (subErr, result) {
              commerceAdapter.orderHold(order.incrementId, function(err, data){
                return cb(err);
              });
            });
          }
          else {
            // Debit succeed
            logger.info('3) Success, add a comment and mark order as "processing"');
            // 3) Add a comment and mark order as "processing"
            commerceAdapter.addCommentToOrder(order.incrementId, "Capture succeed, transaction: " + resultDebit.BPOrderId, 'processing', function (err, result) {
              if (err) return cb(err);
              return cb(null, resultDebit.BPOrderId);
            });
          }
        });
      }
    });
  }
}


function getUserDefaultBankId(user, cb) {
  // Check bank accounts
  listBanks(user.BPCustomerId, function(err, data){
    if(err) return cb(err);
    if(data.bankAccounts.length == 0) {
      // error
      return cb({name: 'not-available-payment'}, null);
    }
    var bank;
    for (var i = 0; i < data.bankAccounts.length; i++) {
      bank = data.bankAccounts[i];
      if(bank.state == 'succeeded') {
        return cb(null, bank.id);
      }
    }
    return cb({name: 'not-bank-verified'}, bank.id);
  });
}

function setUserDefaultBank(user, cb) {
  getUserDefaultBankId(user, function(err, data){
    if(err && (err.name == 'not-bank-verified')) {
      user.payment = {verify:{status:'pending'}};
      userService.save(user, function(err, dataUpdateUser){
        if(err){
          return cb(err);
        }
        return cb(null,dataUpdateUser.payment);
      });
    }
    else if(err && (err.name == 'not-available-payment')) {
      user.payment = {};
      userService.save(user, function(err, dataUpdateUser){
        if(err){
          return cb(err);
        }
        return cb(null,dataUpdateUser.payment);
      });
    }
    else {
      user.payment = {verify:{status:'succeeded'}};
      userService.save(user, function(err, dataUpdateUser){
        if(err){
          return cb(err);
        }
        return cb(null,dataUpdateUser.payment);
      });
    }
  })
}

function getUserDefaultCardId(user, cb) {
  // Check bank accounts
  listCards(user.BPCustomerId, function(err, data){
    if(err) return cb(err);
    if(data.cards.length == 0) {
      // error
      return cb({name: 'not-available-payment'}, null);
    }
    var card = data.cards[0];
    return cb(null, card.id);
  });
}

exports.paymentAdapter = paymentAdapter;
exports.createCustomer = createCustomer;
exports.associateCard = associateCard;
exports.associateBank = associateBank;
exports.debitCard = debitCard;
exports.createCard = createCard;
exports.createBank = createBank;
exports.createOrder = createOrder;
exports.listCustomerBanks = listCustomerBanks;
exports.listCards = listCards;
exports.createBankVerification = createBankVerification;
exports.loadBankVerification = loadBankVerification;
exports.confirmBankVerification = confirmBankVerification;
exports.updateOrderDescription = updateOrderDescription;
exports.prepareUser = prepareUser;
exports.collectPendingOrders = collectPendingOrders;
exports.debitOrderCreditCard = debitOrderCreditCard;
exports.debitOrderDirectDebit = debitOrderDirectDebit;
exports.capture = capture;
exports.getUserDefaultBankId = getUserDefaultBankId;
exports.listBanks = listBanks;
exports.setUserDefaultBank = setUserDefaultBank;
exports.fetchBank = fetchBank;
exports.fetchCard = fetchCard;
exports.fetchDebit = fetchDebit;
exports.getUserDefaultCardId = getUserDefaultCardId;
exports.deleteBankAccount = deleteBankAccount;
