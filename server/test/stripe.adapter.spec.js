/**
 * Created by riclara on 4/8/15.
 */
'use strict';
var assert = require('assert');
var stripAdapter =  require('../api/adapters/strip.adapter');
var modelSpec = require('./stripe.adapter.model.spec');

describe('strip adapter', function(){
  it('generate token card' , function(done){
    this.timeout(60000);
    var card = modelSpec.tokenData;

    stripAdapter.generateToken(card, function(err, token){
      if(err) return done(err);
      assert(token.length > 0);
      done();
    });
  });

  it('create customer', function(done){
    this.timeout(60000);
    var customer = modelSpec.customerData;

    stripAdapter.createCustomer(customer, function(err, data){
      if(err) return done(err);
      assert(data);
      modelSpec.customerRes = data;
      done();
      });

  });
});
