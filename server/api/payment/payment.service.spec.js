'use strict';

var should = require('should');
var app = require('../../app');
var assert = require('chai').assert;
var config = require('../../config/environment');
var request = require('supertest');
var paymentService = require('./payment.service');
var paymentCronService = require('./payment.cron.service');
var balanced = require('balanced-official');
var authService = require('../auth/auth.service');
var userService = require('../user/user.service');
var logger = require('../../config/logger');

describe('payment.service', function() {
  var userId = "54c02be3d650df432698c685";
  this.timeout(10000);

  it("verify user payment state", function(done) {
    var filter= {_id: userId};
    userService.findOne(filter, function(err, user){
      if (err) return done(err);
      paymentService.setUserDefaultBank(user, function (err, data) {
        if(data.verify && data.verify.status === 'pending'){
          logger.info('user without verified account.');
        }else if(data.verify && data.verify.status === 'succeeded'){
          assert.equal(data.verify.status, 'succeeded');
          logger.info('user with verified account.');
        }else{
          assert.deepEqual(user.payment,{});
          logger.info('user without method payment.');
        }
        done();
      });

    });
  });

  it("collectOneTimePayments", function(done) {
    this.timeout(120000);
    paymentCronService.collectOneTimePayments(function (err, data) {
      assert.equal(err, null);
      assert.equal(data, true);
      done();
    });
  });

  it("collectLoanPayments", function(done) {
    this.timeout(120000);
    paymentCronService.collectLoanPayments('minutes',function (err, data) {
      assert.equal(err, null);
      assert.equal(data, true);
      done();
    });
  });

  it("sendRemindToAddPaymentMethod", function(done) {
    this.timeout(120000);
    paymentCronService.sendRemindToAddPaymentMethod(function (err, data) {
      assert.equal(err, null);
      assert.equal(data, true);
      done();
    });
  });

  it("sendRemindToVerifyAccount", function(done) {
    this.timeout(120000);
    paymentCronService.sendRemindToVerifyAccount(function (err, data) {
      assert.equal(err, null);
      assert.equal(data, true);
      done();
    });
  });

  it("sendTomorrowChargeLoan", function(done) {
    this.timeout(120000);
    paymentCronService.sendTomorrowChargeLoan(function (err, data) {
      assert.equal(err, null);
      assert.equal(data, true);
      done();
    });
  });

});
