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


module.exports = {
  generateToken : generateToken,
  createCustomer : createCustomer
}

