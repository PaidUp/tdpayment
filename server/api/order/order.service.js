'use strict';

var config = require('../../config/environment');
var paymentAdapter = require(config.payment.adapter);

function createOrder (merchantCustomerId, description, cb) {
  paymentAdapter.createOrder(merchantCustomerId, description, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function updateOrderDescription (orderId, description, cb) {
  paymentAdapter.updateOrderDescription(orderId, description, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
};

function fetchDebit (debitId, cb){
  paymentAdapter.fetchDebit(debitId, function(err, bank){
    if(err) return cb(err);
    return cb(null, bank);
  });
}

module.exports = {
  createOrder : createOrder,
  updateOrderDescription : updateOrderDescription,
  fetchDebit : fetchDebit
}



