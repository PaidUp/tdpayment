'use strict';

var paymentAdapter = require('../adapters/balancedpayments.adapter');

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
