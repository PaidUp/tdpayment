/**
 * Created by riclara on 2/12/15.
 */
'use strict';

var app = require('../../../app');
var bankService = require("./bank.service");
var modelSpec = require('./bank.model.spec');
var assert = require('chai').assert;

describe('bank.service', function(){
  it('save bank account', function(done){
    bankService.save(modelSpec.bankAccount, function(err, data){
      assert(data._id);
      modelSpec.bankAccount = data;
      done();
    });
  });

  it('find one bank account', function(done){
    bankService.findOne({verificationId:modelSpec.bankAccount.verificationId}, function(err, data){
      assert(data);
      done();
    });
  });

  it('update attemps', function(done){
    var attempsExpected = modelSpec.bankAccount.attemps.length + 1;
    bankService.updateAttemps(modelSpec.bankAccount, function(err, data){
      bankService.findOne({verificationId:modelSpec.bankAccount.verificationId}, function(err, bank){
        assert.equal(attempsExpected, bank.attemps.length);
        done();
      });
    });
  });
});
