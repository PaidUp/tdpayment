'use strict';
var config = require('../../config/environment');
var paymentAdapter = require(config.payment.adapter);

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

exports.createConnectAccount = function (dataAccount, cb) {
  var account = {
    email: dataAccount.email,
    country: dataAccount.country
  }
  paymentAdapter.createAccount(account, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.addToSAccount = function (dataToS, cb) {
  paymentAdapter.addToSAccount(dataToS, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.addLegaInfoAccount = function (dataLegal, cb) {
  paymentAdapter.addLegaInfoAccount(dataLegal, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.updateAccount = function (dataUpdate, cb) {
  paymentAdapter.updateAccount(dataUpdate.accountId, dataUpdate.data, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.updateCustomer = function (dataUpdate, cb) {
  paymentAdapter.updateCustomer(dataUpdate.accountId, dataUpdate.data, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}