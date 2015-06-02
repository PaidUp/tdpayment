/**
 * Created by riclara on 4/8/15.
 */
'use strict';
var app = require('../app');
var assert = require('chai').assert;
var stripeAdapter = require('../api/adapters/stripe.adapter');
var modelSpec = require('./stripe.adapter.model.spec');
var ip = require('os').networkInterfaces();

describe.only('stripe adapter', function(){
  this.timeout(30000);

  it('generate token card' , function(done){
    var card = modelSpec.tokenData;
    stripeAdapter.generateToken(card, function(err, token){
      if(err) return done(err);
      modelSpec.cardToken = token;
      assert(token.length > 0);
      done();
    });
  });

  it('create customer', function(done){
    var customer = modelSpec.customerData;
    stripeAdapter.createCustomer(customer, function(err, data){
      if(err) return done(err);
      assert(data);
      modelSpec.customerRes = data;
      done();
      });
  });

  it('fetch customer', function(done){
    var customerId = modelSpec.customerRes.id;
    stripeAdapter.fetchCustomer(customerId, function(err, data){
      if(err) return done(err);
      assert(data);
      done();
      });
  });

  it('associate card', function(done){
    var customerId = modelSpec.customerRes.id;
    var cardId = modelSpec.cardToken;
    stripeAdapter.associateCard(customerId ,cardId , function(err, data){
      if(err) return done(err);
      assert(data);
      done();
      });
  });

  it('list Cards', function(done){
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
    var customerId = modelSpec.customerRes.id;
    var cardId = modelSpec.cardId;
    stripeAdapter.fetchCard(customerId, cardId, function(err, data){
      if(err) return done(err);
      assert(data);
      done();
      });
  });

  it('create bank token' , function(done){

    var bankDetails = {
      country: 'US',
      routing_number: '110000000',
      account_number: '000123456789',
      customerId : modelSpec.customerRes.id
    };

    stripeAdapter.createBank(bankDetails , function(err , data){
      if(err) return done(err)
      assert.isDefined(data);
      done();
    })

  });

  it('create account' , function(done){
    stripeAdapter.createAccount(modelSpec.accountDetails , function(err , data){
      if(err) return done(err)
      assert.isDefined(data);
      modelSpec.account = data;
      done();
    })

  });

  it('add bank account to account' , function(done){
    stripeAdapter.addBankToAccount(modelSpec.account.id, modelSpec.bankDetails , function(err , data){
      if(err) return done(err)
      assert.isDefined(data);
      modelSpec.account = data;
      done();
    })
  });

  it.skip('add ToS to account' , function(done){
    var dataToS = {
      accountId:modelSpec.account.id,
      ip: ip.wlan0[0].address
    }
    stripeAdapter.addToSAccount(dataToS , function(err , data){
      if(err) return done(err)
      assert.isDefined(data);
      done();
    })
  });

  it('debit card', function(done){
    var cardId = modelSpec.cardId;
    var amount = modelSpec.amount;
    var description = modelSpec.description;
    var appearsOnStatementAs = modelSpec.appearsOnStatementAs;
    var orderId = modelSpec.orderId;
    var customerId = modelSpec.customerRes.id;//cus
    var destination = modelSpec.account.id;//acc
    stripeAdapter.debitCard(cardId, amount, description, appearsOnStatementAs, customerId, destination, function(err, data){
      if(err) return done(err);
      assert(data);
      done();
    });
  });

});
