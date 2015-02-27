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

  var userId = "54b5b284632303121ecaefde";
  var token = authService.signToken(userId);

  var childId = "";
  var cardToken;
  var cartId;
  var athleteId;

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

  it('generateCardToken',function(done) {
    var cardDetails = {
      'number': '4111111111111111',
      'expiration_year': '2016',
      'expiration_month': '12'
    };
    paymentService.createCard(cardDetails, function (err, data) {
      if (err) done(err);
      else {
        assert.isNotNull(data.id);
        cardToken = data.id;
        done();
      }
    });
  });

  it('placeCart', function(done) {
    this.timeout(30000);

    // Place Order
    var data = {
      "cartId":cartId,
      "addresses":[
        {"mode":"billing","firstName":"Ignacio","lastName":"Pascual","address1":"my address my address2","city":"Austin","state":"TX","zipCode":11111,"country":"US","telephone":"1234444555"},
        {"mode":"shipping","firstName":"Ignacio","lastName":"Pascual","address1":"my address my address2","city":"Austin","state":"TX","zipCode":11111,"country":"US","telephone":"1234444555"}],
      "cardId": cardToken,
      "userId": athleteId,
      "paymentMethod": "creditcard",
      "payment": "onetime"
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

});
