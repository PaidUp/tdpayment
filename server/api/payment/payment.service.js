/**
 * Created by riclara on 2/27/15.
 */
'use strict';


var config = require('../../config/environment');
var paymentAdapter = require('./payment.adapter');

/**
 * Create users in balanced payment
 * @param user {firstName, lastName, email, id}
 * @param cb callback function
 */
exports.createCustomer = function (user, cb) {
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

/**
 * Create credit card in balanced payment
 * @param cardDetails
 * @param cb
 */
exports.createCard = function (cardDetails, cb) {
  paymentAdapter.createCard(cardDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.associateCard = function (customerId, cardId, cb) {
  paymentAdapter.associateCard(customerId, cardId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.createBank = function (bankDetails, cb) {
  paymentAdapter.createBank(bankDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.associateBank = function (customerId, bankId, cb) {
  paymentAdapter.associateBank(customerId, bankId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.createOrder = function (merchantCustomerId, description, cb) {
  paymentAdapter.createOrder(merchantCustomerId, description, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.debitCard = function (cardId, amount, description, appearsOnStatementAs, orderId, cb) {
  paymentAdapter.debitCard(cardId, amount, description, appearsOnStatementAs, orderId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.debitBank = function (bankId, amount, description, appearsOnStatementAs, orderId, cb) {
  paymentAdapter.debitBank(bankId, amount, description, appearsOnStatementAs, orderId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.associateBank = function (customerId, bankId, cb) {
  paymentAdapter.associateBank(customerId, bankId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.listCustomerBanks = function (customerId, cb) {
  paymentAdapter.listCustomerBanks(customerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.listCards = function (customerId, cb) {
  paymentAdapter.listCards(customerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.createBankVerification = function (bankId, cb) {
  paymentAdapter.createBankVerification(bankId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.loadBankVerification = function (verificationId, cb) {
  paymentAdapter.loadBankVerification(verificationId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.deleteBankAccount = function (customerId, bankId, cb) {
  paymentAdapter.deleteBankAccount(bankId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.confirmBankVerification = function (verificationId, amount1, amount2, cb) {
  paymentAdapter.confirmBankVerification(verificationId, amount1, amount2, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.updateOrderDescription = function (orderId, description, cb) {
  paymentAdapter.updateOrderDescription(orderId, description, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.createOrder = function (merchantId, description, cb) {
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

exports.listBanks = function (customerId, cb) {
  paymentAdapter.listBanks(customerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.prepareCard = function (userId, cardId, cb) {
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

exports.prepareBank = function (userId, bankId, cb) {
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

exports.fetchBank = function (bankId, cb){
  paymentAdapter.fetchBank(bankId, function(err, bank){
    if(err) return cb(err);
    return cb(null, bank);
  });
}

exports.fetchCard = function (cardId, cb){
  paymentAdapter.fetchCard(cardId, function(err, creditCard){
    if(err) return cb(err);
    return cb(null, creditCard);
  });
}

exports.fetchDebit = function (debitId, cb){
  paymentAdapter.fetchDebit(debitId, function(err, bank){
    if(err) return cb(err);
    return cb(null, bank);
  });
}

exports.getUserDefaultBankId = function (user, cb) {
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

exports.getUserDefaultCardId = function (user, cb) {
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

