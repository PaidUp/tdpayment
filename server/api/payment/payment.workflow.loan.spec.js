'use strict';

var should = require('should');
var app = require('../../app');
var assert = require('chai').assert;
var config = require('../../config/environment');
var request = require('supertest');
var paymentService = require('./payment.service');
var balanced = require('balanced-official');
var authService = require('../auth/auth.service');
var userService = require('../user/user.service');

describe('payment.service', function() {
  this.timeout(10000);
  Error.stackTraceLimit = Infinity;

  var userId = "54c02be3d650df432698c685";
  var token = authService.signToken(userId);

  var cartId;
  var athleteId;
  var loanUserId;
  var applicationId;
  var loanId;

  it('getChild', function(done) {
    request(app)
      .get('/api/v1/user/relation/list')
      .set('Authorization', "Bearer "+token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.operator(0, '<', res.body.length);
        athleteId = res.body[0].targetUserId;
        done();
      });
  });

  it('createCart', function(done) {
    request(app)
      .get('/api/v1/commerce/cart/create')
      .set('Authorization', "Bearer "+token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.isNotNull(cartId, res.body.cartId);
        cartId = res.body.cartId;
        done();
      });
  });

  it('viewCart', function(done) {
    request(app)
      .get('/api/v1/commerce/cart/view/'+cartId)
      .set('Authorization', "Bearer "+token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.grandTotal, 0);
        done();
      });
  });

  it('addToCart', function(done) {
      var data = {"cartId":cartId,"products":[{"productId":"8","sku":"AUSTIN_BOOM","qty":1,"options":{"4":"10","5":"11"}}]};
      request(app)
        .post('/api/v1/commerce/cart/add')
        .set('Authorization', "Bearer "+token)
        .expect(200)
        .send(data)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(true, res.body);
          done();
        });
  });

  it('getTotals', function(done) {
    request(app)
      .get('/api/v1/commerce/cart/totals/'+cartId)
      .set('Authorization', "Bearer "+token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.isNotNull(res.body);
        assert.isNotNull(res.body[0]);
        assert.equal(1674.99, res.body[0].amount);
        done();
      });
  });

  // Loan
  it('createLoanUser', function(done) {
    var data = {
      "firstName":"Ignacio",
      "lastName":"Pascual Gil",
      "ssn":"123456789"
    };
    request(app)
      .post('/api/v1/loan/application/user/create')
      .set('Authorization', "Bearer "+token)
      .expect(200)
      .send(data)
      .end(function(err, res) {
        if (err) return done(err);
        assert.isNotNull(res.body.userId);
        loanUserId = res.body.userId;
        done();
      });
  });

  it('createLoanUserContact1', function(done) {
    var data = {
      "userId":loanUserId,
      "label":"email",
      "type":"email",
      "value":"jesse.cogollo@talosdigital.com"
    };
    request(app)
      .post('/api/v1/loan/application/user/contact/create')
      .set('Authorization', "Bearer "+token)
      .expect(200)
      .send(data)
      .end(function(err, res) {
        if (err) return done(err);
        assert.isNotNull(res.body.contactId);
        done();
      });
  });

  it('createLoanUserContact2', function(done) {
    var data = {
      "userId":loanUserId,
      "label":"telephone",
      "type":"telephone",
      "value":"123456789"
    };
    request(app)
      .post('/api/v1/loan/application/user/contact/create')
      .set('Authorization', "Bearer "+token)
      .expect(200)
      .send(data)
      .end(function(err, res) {
        if (err) return done(err);
        assert.isNotNull(res.body.contactId);
        done();
      });
  });

  it('createLoanUserAddress1', function(done) {
    var data = {
      "userId":loanUserId,
      "address1":"Av. Chavez",
      "state":"TX",
      "city":"Austin",
      "zipCode":"77818",
      "country":"USA",
      "type":"loan",
      "label":"loan"
    };
    request(app)
      .post('/api/v1/loan/application/user/address/create')
      .set('Authorization', "Bearer "+token)
      .expect(200)
      .send(data)
      .end(function(err, res) {
        if (err) return done(err);
        assert.isNotNull(res.body.addressId);
        done();
      });
  });

  it('createLoanApplication', function(done) {
    var data = {
      "incomeType":"Employed (Military)",
      "monthlyGrossIncome":"123456",
      "amount":1650,
      "numberPayments":6,
      "meta":{"userId":loanUserId}
    };
    request(app)
      .post('/api/v1/loan/application/create')
      .set('Authorization', "Bearer "+token)
      .expect(200)
      .send(data)
      .end(function(err, res) {
        if (err) return done(err);
        assert.isNotNull(res.body.applicationId);
        applicationId = res.body.applicationId;
        done();
      });
  });


  it('signLoanApplication', function(done) {
    var data = {
      "firstName":"Ignacio",
      "lastName":"Pascual Gil",
      "ssn":"6789",
      "applicationId":applicationId
    };
    request(app)
      .post('/api/v1/loan/application/sign')
      .set('Authorization', "Bearer "+token)
      .expect(200)
      .send(data)
      .end(function(err, res) {
        if (err) return done(err);
        assert.isNotNull(res.body.loanId);
        loanId = res.body.loanId;
        done();
      });
  });

  it('placeCart', function(done) {
    this.timeout(20000);

    // Place Order
    var data = {
      "cartId":cartId,
      "loanId":loanId,
      "addresses":[
        {"mode":"billing","firstName":"Ignacio","lastName":"Pascual","address1":"my address my address2","city":"Austin","state":"TX","zipCode":11111,"country":"US","telephone":"1234444555"},
        {"mode":"shipping","firstName":"Ignacio","lastName":"Pascual","address1":"my address my address2","city":"Austin","state":"TX","zipCode":11111,"country":"US","telephone":"1234444555"}],
      "userId": athleteId,
      "paymentMethod": "directdebit",
      "payment": "loan"
    };
    request(app)
      .post('/api/v1/commerce/checkout/place')
      .set('Authorization', "Bearer "+token)
      .expect(200)
      .send(data)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });

  });

  // POST
  // /api/v1/payment/bank/create
  // {"bankId":"BA1VkCIw2WmtLQR3ZY1Rc0Kc"}

  // POST
  // /api/v1/payment/bank/verify
  //{"deposit1":"1","deposit2":"1","verificationId":"BZ23iPtxnOAc0MdlmOfOwb9H"}
});
