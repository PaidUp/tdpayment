'use strict';

var stripe = require('stripe')('sk_test_i1WgQIKn3mXx4GP5B8Yh79U1');


function generateToken(data, cb){
  console.log('generate token log');
  stripe.tokens.create(data).then(
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

  stripe.customers.create(stripCustomer, function(err, customer) {
    if(err) return cb(err);
    cb(null , customer);
  });
};


module.exports = {
  generateToken : generateToken,
  createCustomer : createCustomer
}

