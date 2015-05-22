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