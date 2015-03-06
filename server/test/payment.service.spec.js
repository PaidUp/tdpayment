'use strict';
var assert = require('assert');
var customerService = require('../api/customer/customer.service');
var bankService = require('../api/bank/bank.service');
var orderService = require('../api/order/order.service');
var cardService = require('../api/card/card.service');
var modelSpec = require('./payment.model.spec.js');


function createOrder(order, cb){
    orderService.createOrder(order.merchantCustomerId, order.description, function(err, datao){
        if(err){
            return cb(err);
        }
        return cb(null, datao);
    });
};


describe('payment services test', function () {
  it('createCustomer', function (done) {
    this.timeout(60000);
    var user = modelSpec.user;
    customerService.createCustomer(user, function (err, data) {
      if (err) {
        return done(err);
      }
        assert.equal(user.email, data.email, 'The email is not equal');
        modelSpec.customer = data;
        return done();
    });
  });
  it('createBank', function(done){
    this.timeout(60000);
    var bankDetails =  modelSpec.bankDetails();
    bankService.createBank(bankDetails, function(err, data){
      if(err){
        return done(err);
      }
      modelSpec.bankAccount = data;
      assert(data, 'The response create bank must be exist');

      var last4Exp = modelSpec.bankDetails().account_number.slice(6);
      var last4 = data.account_number.slice(6);
      assert.equal(last4Exp, last4);
      return done();
    });
  });
  it('associateBank', function(done){
    this.timeout(60000);
    var associateBankData = modelSpec.associateBankData();

    bankService.associateBank(associateBankData.customerId, associateBankData.bankId, function(err, data){
      if(err){
        return done(err);
      }
      assert.equal(1, data.bankAccounts.length, 'Expected one account associated');
      return done();
    })
  });
  it('createOrderBank', function(done){
    this.timeout(60000);
    var order = modelSpec.order();
    createOrder(order, function(err, datao){
      if(err){
        return done(err);
      }
      assert(datao,'The response must not be null');
      modelSpec.orderBankId = datao.orders[0].id;
      return done();
    });
  });
  it('createBankVerification', function(done){
    this.timeout(60000);
    var dataBankId = {
      bankId : modelSpec.bankAccount.id
    };
    bankService.createBankVerification(dataBankId, function(err, data){
      if(err){
        done(err);
      }
      assert.equal(1, data.bankAccountVerifications.length, 'Must exist one account pending to verification');
      modelSpec.bankAccountVerification = data.bankAccountVerifications[0];
      done();
    });
  });

  it('confirmBankVerification', function(done){
    this.timeout(60000);
    var confirmBankVerificationData = modelSpec.confirmBankVerificationData();
    bankService.confirmBankVerification(confirmBankVerificationData, function(err, data){
      if(err){
        done(err);
      }
      assert.equal(1, data.bankAccountVerifications.length, 'Must exist one account pending to verification');
      modelSpec.bankAccountVerification = data.bankAccountVerifications[0];
      done();
    });
  });

  it('debitBank', function(done){
    this.timeout(60000);
    var debitBankData = modelSpec.debitBankData();
    bankService.debitBank(debitBankData, function(err, data){
      if(err){
        return done(err);
      }
      assert.equal(1, data.debits.length, 'Must exist one debit bank');
      modelSpec.debitBankResponse = data;
      return done();
    });
  });

  it('fetchDebit', function(done){
    this.timeout(60000);
    var debitId = modelSpec.debitBankResponse.debits[0].id;
    orderService.fetchDebit(debitId, function(err, data){
      if(err){
        return done(err);
      }
      assert.equal(1, data.debits.length, 'Must exist one debit bank');
      modelSpec.debitBankResponse = data;
      return done();
    });
  });

  it('listCustomerBanks', function(done){
    this.timeout(60000);
    bankService.listCustomerBanks(modelSpec.customer.id, function(err, data){
      if(err){
        return done(err);
      }
      assert.equal(1, data.bankAccounts.length, 'Must exist one bank account');
      return done();
    });
  });
  it('loadBankVerification', function(done){
    this.timeout(60000);
    bankService.loadBankVerification({verificationId : modelSpec.bankAccountVerification.id}, function(err, data){
      if(err){
        return done(err);
      }
      assert.equal(1, data.bankAccountVerifications.length, 'Must exist one credit card');
      assert.equal('succeeded', data.bankAccountVerifications[0].verificationStatus, 'Must be succeeded state');
      return done();
    });
  });
  it('listBanks', function(done){
    this.timeout(60000);
    bankService.listBanks({customerId:modelSpec.customer.id}, function(err, data){
      if(err){
        return done(err);
      }
      assert.equal(1, data.bankAccounts.length, 'Must exist one bank account');
      return done();
    });
  });
  it('prepareBank', function(done){
    this.timeout(60000);
    var prepareBankData = modelSpec.prepareBankData();
    bankService.prepareBank(prepareBankData, function(err, data){
      if(err){
        return done(err);
      }
      assert.equal(1, data.bankAccounts.length, 'Must exist one bank account');
      return done();
    });
  });
  it('fetchBank', function(done){
    this.timeout(60000);
    bankService.fetchBank(modelSpec.bankAccount.id, function(err, data){
      if(err){
        return done(err);
      }
      assert.equal(1, data.bankAccounts.length, 'Must exist one bank account');
      return done();
    });
  });
  it('getUserDefaultBankId', function(done){
    this.timeout(60000);
    bankService.getUserDefaultBankId({customerId : modelSpec.customer.id}, function(err, data){
      if(err){
        return done(err);
      }
      assert.equal(modelSpec.bankAccount.id, data, 'bank id is not correct');
      return done();
    });
  });
  it('deleteBankAccount', function(done){
    this.timeout(60000);
    bankService.deleteBankAccount({bankId : modelSpec.bankAccount.id}, function(err, data){
      if(err){
        return done(err);
      }
      assert.equal('{}', JSON.stringify(data));
      return done();
    });
  });

  it('createCard',function(done){
      this.timeout(60000);
      var cardDetails = modelSpec.cardDetails;
      cardService.createCard(cardDetails, function(err, data){
          if(err){
              return done(err);
          }
          assert(data, 'No data response from credit card');
          assert.notEqual(0, data.id.length, 'id from credit card is not present');
          modelSpec.creditCard = data;
          return done();
      })
  });
  it('associateCard', function(done){
      this.timeout(60000);
      var data = modelSpec.associateCardData();
      cardService.associateCard(data.customerId, data.cardId, function(err, data){
          if(err){
            return done(err);
          }
          assert(data.cards.length === 1, 'The card associate must be one');
          return done();
      });
  });

  it('createOrder', function(done){
      this.timeout(60000);
      var order = modelSpec.order();
      createOrder(order, function(err, datao){
          if(err){
              return done(err);
          }
          assert(datao,'The response must not be null');
          modelSpec.orderId = datao.orders[0].id;
          return done();
      });
  });

  it('debitCard', function(done){
      this.timeout(60000);
      var debitCardData = modelSpec.debitCardData();

      cardService.debitCard(debitCardData, function(err, data){
          if(err)
          return done(err);
          assert.equal(1, data.debits.length, 'Must exist one debit');
          return done();
      });
  });

  it('listCards', function(done){
      this.timeout(60000);
      cardService.listCards({customerId : modelSpec.customer.id}, function(err, data){
          if(err){
               return done(err);
          }
          assert.equal(1, data.cards.length, 'Must exist one credit card');
          return done();
        });
  })

    it('prepareCard', function(done){
        this.timeout(60000);
        var prepareCardData = modelSpec.prepareCardData();
        cardService.prepareCard(prepareCardData, function(err, data){
            if(err){
                return done(err);
            }
            assert.equal(1, data.cards.length, 'Must exist one credit card');
            return done();
        });
    });


    it('fetchCard', function(done){
        this.timeout(60000);
        cardService.fetchCard(modelSpec.creditCard.id, function(err, data){
            if(err){
                return done(err);
            }
            assert.equal(1, data.cards.length, 'Must exist one credit card');
            return done();
        });
    });


    it('getUserDefaultCardId', function(done){
        this.timeout(60000);
        cardService.getUserDefaultCardId({customerId : modelSpec.customer.id}, function(err, data){
            if(err){
                return done(err);
            }
            assert.equal(modelSpec.creditCard.id, data, 'card id is not correct');
            return done();
        });
    });


});
