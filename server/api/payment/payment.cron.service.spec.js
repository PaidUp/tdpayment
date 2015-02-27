'use strict';

var should = require('should');
var app = require('../../app');
var assert = require('chai').assert;
var config = require('../../config/environment');
var request = require('supertest');
var balanced = require('balanced-official');
var paymentCronService = require('./payment.cron.service');
var fs = require("fs");

describe('payment.cron.service', function() {
  this.timeout(60000);

  it('collectCreditCardPayments', function(done) {
    this.timeout(20000);
    paymentCronService.collectOneTimePayments(function(err, data){
      if(err) done(err);
      assert.equal(true, data);
      done();
    });
  });

  it('collectLoanPayments', function(done) {
    paymentCronService.collectLoanPayments('minutes', function (err, data) {
      if (err) done(err);
      assert.equal(true, data);
      done();
    });
  });

  it('sendRemindToAddPaymentMethod', function(done) {
    paymentCronService.sendRemindToAddPaymentMethod(function (err, data) {
      if (err) done(err);
      assert.equal(true, data);
      done();
    });
  });

  it('sendRemindToVerifyAccount', function(done) {
    paymentCronService.sendRemindToVerifyAccount(function (err, data) {
      if (err) done(err);
      assert.equal(true, data);
      done();
    });
  });

  it('sendTomorrowChargeLoan', function(done) {
    paymentCronService.sendTomorrowChargeLoan(function (err, data) {
      if (err) done(err);
      assert.equal(true, data);
      done();
    });
  });

});
