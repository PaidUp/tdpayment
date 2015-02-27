'use strict';

var should = require('should');
var app = require('../../app');
var assert = require('chai').assert;
var config = require('../../config/environment');
var request = require('supertest');

var paymentEmailService = require('./payment.email.service');

describe('payment.service', function() {
  this.timeout(10000);
  Error.stackTraceLimit = Infinity;

  var userId = "54b7d425f8678f36499af041";

  var requestObject = {
    userId: userId,
    bankId: ''
  };

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

});
