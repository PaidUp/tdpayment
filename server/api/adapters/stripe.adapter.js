'use strict';

//var mongoose = require('mongoose');
var config = require('../../config/environment');
//var balanced = require('balanced-official');
//var https = require('https');
//var querystring = require('querystring');
//var async = require('async');
//var camelize = require('camelize');
//var balancedApi = config.payment.balanced.api;
var stripeApi = require('stripe')(config.payment.stripe.api);

function generateToken(data, cb){
  console.log('generate token log');
  stripeApi.tokens.create(data).then(
    function(result) {
      cb(null, result.id);
    },
    function(err) {
      cb(err);
    }
  );

};

function createCustomer(customer, cb){
  var stripCustomer = {
    description : customer.name,
    mail : customer.mail,
    metadata : customer.meta
  }

  stripeApi.customers.create(stripCustomer, function(err, customer) {
    if(err) return cb(err);
    cb(null , customer);
  });
};

/**
 *
 * @param bankDetails obj {country, routing_number, account_number }
 * @param cb callback(err, token)
 */
function createBank(bankDetails, cb) {
  var bankAccount = {
    bank_account: {
      country: bankDetails.country,
      routing_number: bankDetails.routing_number,
      account_number: bankDetails.account_number
    }
  };

  stripeApi.tokens.create(bankAccount, function(err, token) {
    if(err) return cb(err);

    return cb(null , token);
  });
}


module.exports = {
  generateToken : generateToken,
  createCustomer : createCustomer,
  createBank : createBank
}

