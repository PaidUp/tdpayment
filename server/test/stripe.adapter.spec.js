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

  it('fetch customer I', function(done){
    var customerId = modelSpec.customerRes.id;
    stripeAdapter.fetchCustomer(customerId, function(err, data){
      if(err) return done(err);
      assert(data);
      assert.equal(data.id,modelSpec.customerRes.id);
      assert.equal(data.livemode,modelSpec.customerRes.livemode);
      assert.equal(data.email,modelSpec.customerRes.email);
      assert.equal(data.defaultSource,null);
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

  it('add ToS to account' , function(done){
    this.timeout(30000);
    var dataToS = {
      accountId:modelSpec.account.id,
      ip: '192.168.1.9'
    }
    stripeAdapter.addToSAccount(dataToS , function(err , data){
      if(err) return done(err)
      assert.isDefined(data);
      done();
    })
  });

  it('add Legal info to account' , function(done){
    this.timeout(30000);
    var legalEntity= {
        accountId:modelSpec.account.id,
        firstName:'first_name',
        lastName:'last_name',
        day:12,
        month:12,
        year:1987,
        type:'company',
        businessName:'business_name',
        last4:'0000',
        EIN:'00-0000000',
        line1:'Street address',
        line2:'Apartment',
        city:'Austin',
        state:'Tx',
        postalCode:'00000',
        country:'US',
        personalIdNumber: '123450000'
      }
    stripeAdapter.addLegaInfoAccount(legalEntity , function(err , data){
      if(err) return done(err)
      assert.isDefined(data);
      done();
    })
  });

  it('update account' , function(done){
    this.timeout(30000);
    var data= {
        statement_descriptor:'first_name'+ ' ' + 'last_name'
      }
    stripeAdapter.updateAccount(modelSpec.account.id, data , function(err , data){
      if(err) return done(err)
      assert.isDefined(data);
      done();
    })
  });

  it.skip('Uploading a file' , function(done){
    this.timeout(30000);
    var legalEntity= {
      legal_entity: {
        additional_owners: ''
      }
    };
    stripeAdapter.UploadingFileAccount(legalEntity, function(err , data){
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
    stripeAdapter.debitCard(cardId, amount, description, appearsOnStatementAs, customerId, destination,10, {data : 'test'}, function(err, data){
      if(err) return done(err);
      assert(data);
      done();
    });
  });


  it.skip('generate token with invalid card' , function(done){
    var card = modelSpec.tokenDataFail;
    stripeAdapter.generateToken(card, function(err, token){
      if(err) return done(err);
      modelSpec.cardTokenFail = token;
      assert(token.length > 0);
      done();
    });
  });

  it.skip('associate invalid card', function(done){
    var customerId = modelSpec.customerRes.id;
    var cardId = modelSpec.cardTokenFail;
    stripeAdapter.associateCard(customerId ,cardId , function(err, data){
      if(err) return done(err);
      assert(data);
      assert.equal(data.object,'card');
      assert.equal(data.brand,'Visa');
      assert.equal(data.last4,'0019');
      assert.equal(data.funding,'credit');
      assert.equal(data.expMonth,7);
      assert.equal(data.expYear,2016);
      assert.equal(data.country,'US');
      assert.equal(data.cvcCheck,'unavailable');
      done();
      });
  });

  it.skip('list Cards again', function(done){
    var customerId = modelSpec.customerRes.id;
    stripeAdapter.listCards(customerId, function(err, data){
      if(err) return done(err);
      assert.operator(data.data.length, '>', 0,'retrieve cards associate');
      modelSpec.cardIdFail = data.data[1].id;
      assert(data);
      done();
      });
  });

  it.skip('debit card with invalid card', function(done){
    var cardId = modelSpec.cardIdFail;
    var amount = modelSpec.amount;
    var description = modelSpec.description;
    var appearsOnStatementAs = modelSpec.appearsOnStatementAs;
    var orderId = modelSpec.orderId;
    var customerId = modelSpec.customerRes.id;//cus
    var destination = modelSpec.account.id;//acc
    stripeAdapter.debitCard(cardId, amount, description, appearsOnStatementAs, customerId, destination,10, {data : 'test'}, function(err, data){
      assert(err);
      assert.equal(err.type,'StripeCardError');
      assert.equal(err.code,'card_declined');
      assert.equal(err.message,'Your card was declined.');
      done();
    });
  });

  it('fetch customer II', function(done){
    var customerId = modelSpec.customerRes.id;
    stripeAdapter.fetchCustomer(customerId, function(err, data){
      if(err) return done(err);
      assert(data);
      assert.equal(data.id,modelSpec.customerRes.id);
      assert.equal(data.livemode,modelSpec.customerRes.livemode);
      assert.equal(data.email,modelSpec.customerRes.email);
      assert.equal(data.defaultSource,modelSpec.cardId);
      done();
      });
  });

  it.skip('update customer', function(done){
    var customerId = modelSpec.customerRes.id;
    var dataSend = {
      description:'test',
      default_source:modelSpec.cardIdFail
    }
    stripeAdapter.updateCustomer(customerId, dataSend, function(err, data){
      if(err) return done(err);
      assert(data);
      assert.equal(data.id,modelSpec.customerRes.id);
      assert.equal(data.livemode,modelSpec.customerRes.livemode);
      assert.equal(data.email,modelSpec.customerRes.email);
      assert.equal(data.defaultSource,modelSpec.cardIdFail);
      assert.equal(data.description,'test');
      done();
      });
  });

  it.skip('fetch customer III', function(done){
    var customerId = modelSpec.customerRes.id;
    stripeAdapter.fetchCustomer(customerId, function(err, data){
      modelSpec.cardIdFail
      if(err) return done(err);
      assert(data);
      assert.equal(data.id,modelSpec.customerRes.id);
      assert.equal(data.livemode,modelSpec.customerRes.livemode);
      assert.equal(data.email,modelSpec.customerRes.email);
      assert.equal(data.defaultSource,modelSpec.cardIdFail);
      assert.equal(data.description,'test');
      done();
      });
  });


});
