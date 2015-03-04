'use strict';

var should = require('should');
var app = require('../../app');
var assert = require('chai').assert;
var config = require('../../config/environment');
var request = require('supertest');
var paymentService = require('./payment.service');
var balanced = require('balanced-official');
var logger = require('../../config/logger');
//logger.info(err, err);

var testingApi;
var testCustomer;
var testMerchant;
var testCard;
var testBank;
var verificationId;
var testOrderId;

describe('payment.adapter', function() {
  this.timeout(30000);

  it('createTestingApi', function(done) {
    balanced.api_key.create().then(function(obj) {
      testingApi = obj.secret;
      paymentService.paymentAdapter.setBalancedApi(testingApi);
      done();
    });
  });

  it('createCustomer', function (done) {
    testCustomer = {
      name: "Ignacio Pascual",
      email: "jesse.cogollo@talosdigital.com"
    };
    paymentService.createCustomer(testCustomer, function (err, data) {
      if (err) done(err);
      else {
        assert.isNotNull(data.id);
        testCustomer = data;
        done();
      }
    });
  });

  it('createBank', function (done) {
    var bankDetails = {
      name: "Miranda Benz",
      account_number: "9900826301",
      routing_number: "021000021"
    };

    paymentService.createBank(bankDetails, function (err, data) {
      if (err) done(err);
      else {
        assert.isNotNull(data.id);
        testBank = data;
        done();
      }
    });
  });

  it('associateBank', function (done) {
    paymentService.associateBank(testCustomer.id, testBank.id, function (err, data) {
      if (err) return done(err);
      assert.isNotNull(data.bankAccounts);
      assert.isNotNull(data.bankAccounts[0].links.customer);
      done();
    });
  });

  it('createBankVerification', function (done) {
    paymentService.createBankVerification(testBank.id, function (err, data) {
      if (err) done(err);
      assert.isNotNull(data.bankAccountVerifications[0]);
      verificationId = data.bankAccountVerifications[0].id;
      done();
    });
  });

  it('listCustomerBanks', function (done) {
    paymentService.listCustomerBanks(testCustomer.id, function (err, data) {
      if (err) return done(err);
      assert.equal(verificationId, data.bankAccounts[0].links.bankAccountVerification);
      assert.equal(data.bankAccounts[0].links.customer, testCustomer.id);
      done();
    });
  });

  it("listBanks", function(done) {
    paymentService.listBanks(testCustomer.id, function (err, data) {
      if (err) done(err);
      assert.isNotNull(data.bankAccounts[0].state);
      assert.equal(data.bankAccounts[0].state, 'pending');
      done();
    });
  });

  it('loadBankVerification', function (done) {
    paymentService.loadBankVerification(verificationId, function (err, data) {
      if (err) done(err);
      assert.isNotNull(data.bankAccountVerifications[0]);
      done();
    });
  });

  it('confirmBankVerification', function (done) {
    paymentService.confirmBankVerification(verificationId, 1, 1, function (err, data) {
      if (err) done(err);
      assert.isNotNull(data.bankAccountVerifications[0]);
      assert.equal(data.bankAccountVerifications[0].verificationStatus, 'succeeded');
      assert.equal(data.bankAccountVerifications[0].attempts, 1);
      done();
    });
  });

  it("listBanks", function(done) {
    paymentService.listBanks(testCustomer.id, function (err, data) {
      if (err) done(err);
      assert.isNotNull(data.bankAccounts[0].state);
      assert.equal(data.bankAccounts[0].state, 'succeeded');
      done();
    });
  });

  it('createCard', function (done) {
    var cardDetails = {
      'number': '4111111111111111',
      'expiration_year': '2016',
      'expiration_month': '12'
    };
    paymentService.createCard(cardDetails, function (err, data) {
      if (err) done(err);
      else {
        assert.isNotNull(data.id);
        testCard = data;
        done();
      }
    });
  });

  it('associateCard', function (done) {
    paymentService.associateCard(testCustomer.id, testCard.id, function (err, data) {
      if (err) return done(err);
      assert.isNotNull(data.cards);
      assert.isNotNull(data.cards[0].links.customer);
      done();
    });
  });

  it('listCards', function (done) {
    paymentService.listCards(testCustomer.id, function (err, data) {
      if (err) return done(err);
      assert.isNotNull(data.cards[0]);
      done();
    });
  });

  it('createMerchant', function (done) {
    testMerchant = {
      name: "Austin Boom",
      email: "infoo@austinboom.com"
    };
    paymentService.createCustomer(testMerchant, function (err, data) {
      if (err) done(err);
      assert.isNotNull(data.id);
      testMerchant = data;
      done();
    });
  });

  it('createOrder', function (done) {
    paymentService.createOrder(testMerchant.id, "Order: xxxxx", function (err, data) {
      if (err) return done(err);
      assert.isNotNull(data);
      testOrderId = data;
      done();
    });
  });

  it('debitCardToOrder', function (done) {
    paymentService.debitCard(testCard.id, 150, "Order: xxxxx", "Conv.Select", testOrderId, function (err, data) {
      if (err) return done(err);
      assert.equal(data.debits[0].status, 'succeeded');
      assert.equal(data.debits[0].description, 'Order: xxxxx');
      assert.equal(data.debits[0].amount, 150 * 100);
      done();
    });
  });

  it('updateOrderDescription', function (done) {
    paymentService.updateOrderDescription(testOrderId, "Order: 12222333", function (err, data) {
      if (err) return done(err);
      assert.isNotNull(data.orders);
      assert.isNotNull(data.orders[0]);
      assert.equal(data.orders[0].id, testOrderId);
      assert.equal(data.orders[0].description, "Order: 12222333");
      done();
    });
  });

});
