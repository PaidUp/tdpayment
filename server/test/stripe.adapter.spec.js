/**
 * Created by riclara on 4/8/15.
 */
'use strict';
var app = require('../app');
var assert = require('chai').assert;
var stripeAdapter = require('../api/adapters/stripe.adapter');
var modelSpec = require('./stripe.adapter.model.spec');
describe.only('stripe adapter', function(){
  it('generate token card' , function(done){
    this.timeout(60000);
    var card = modelSpec.tokenData;
    stripeAdapter.generateToken(card, function(err, token){
      if(err) return done(err);
      modelSpec.cardToken = token;
      assert(token.length > 0);
      done();
    });
  });

  it('create customer', function(done){
    this.timeout(60000);
    var customer = modelSpec.customerData;
    stripeAdapter.createCustomer(customer, function(err, data){
      if(err) return done(err);
      assert(data);
      modelSpec.customerRes = data;
      done();
      });
  });

  it('fetch customer', function(done){
    this.timeout(60000);
    var customerId = modelSpec.customerRes.id;
    stripeAdapter.fetchCustomer(customerId, function(err, data){
      if(err) return done(err);
      assert(data);
      done();
      });
  });

  it('associate card', function(done){
    this.timeout(60000);
    var customerId = modelSpec.customerRes.id;
    var cardId = modelSpec.cardToken;
    stripeAdapter.associateCard(customerId ,cardId , function(err, data){
      if(err) return done(err);
      assert(data);
      done();
      });
  });

  it('list Cards', function(done){
    this.timeout(60000);
    var customerId = modelSpec.customerRes.id;
    stripeAdapter.listCards(customerId, function(err, data){
      if(err) return done(err);
      assert.operator(data.data.length, '>', 0,'retrieve cards associate');
      modelSpec.cardId = data.data[0].id;
      assert(data);
      done();
      });
  });

  it('fetch card', function(done){
    this.timeout(60000);
    var customerId = modelSpec.customerRes.id;
    var cardId = modelSpec.cardId;
    stripeAdapter.fetchCard(customerId, cardId, function(err, data){
      if(err) return done(err);
      assert(data);
      done();
      });
  });

  it('generate token card2' , function(done){
    this.timeout(60000);
    var card = modelSpec.tokenData;
    stripeAdapter.generateToken(card, function(err, token){
      if(err) return done(err);
      modelSpec.cardToken2 = token;
      assert(token.length > 0);
      done();
    });
  });

  it('debit card', function(done){
    this.timeout(60000);
    var cardToken = modelSpec.cardToken2;
    var amount = modelSpec.amount;
    var description = modelSpec.description;
    var appearsOnStatementAs = modelSpec.appearsOnStatementAs;
    var orderId = modelSpec.orderId;
    stripeAdapter.debitCard(cardToken, amount, description, appearsOnStatementAs, orderId, function(err, data){
      if(err) return done(err);
      assert(data);
      done();
      });
  });

  it('create bank token' , function(done){
    this.timeout(60000);
    var bankDetails = {
      country: 'US',
      routing_number: '110000000',
      account_number: '000123456789'
    };

    stripeAdapter.createBank(bankDetails , function(err , data){
      if(err) return done(err)
      assert.isDefined(data.id);
      done();
    })

  });

});
