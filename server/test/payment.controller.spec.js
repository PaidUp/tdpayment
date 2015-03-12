/**
 * Created by riclara on 3/5/15.
 */

'use strict';

var app = require('../app');
var request = require('supertest');
var assert = require('chai').assert;
var modelSpec = require('./payment.model.spec');

var token = require('../config/environment').nodePass.me.token;

describe.only('test customer controller' , function(){
  it('create customer' , function(done){
    this.timeout(60000);
    var user = modelSpec.user;
    request(app)
      .post('/api/v1/customer/create')
      .set('Authorization', token)
      .send(user)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal(user.firstName +' '+ user.lastName,  res.body.name, 'The name in not correct');
        assert.equal(user.email,  res.body.email, 'The email in not correct');
        modelSpec.customer = res.body;
        done();
      });
  });

  it('create bank' , function(done){
    this.timeout(60000);
    var bankDetails =  modelSpec.bankDetails();
    request(app)
      .post('/api/v1/bank/create')
      .set('Authorization', token)
      .send(bankDetails)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        modelSpec.bankAccount = res.body;
        assert(res.body, 'The response create bank must be exist');
        done();
      });
  });

  it('associate bank' , function(done){
    this.timeout(60000);
    var associateBankData = modelSpec.associateBankData();
    request(app)
      .post('/api/v1/bank/associate')
      .set('Authorization', token)
      .send(associateBankData)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal(1, res.body.bankAccounts.length, 'Expected one account associated');
        done();
      });
  });

  it('create order bank' , function(done){
    this.timeout(60000);
    var order = modelSpec.order();
    request(app)
      .post('/api/v1/order/create')
      .set('Authorization', token)
      .send(order)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert(res.body,'The response must not be null');
        modelSpec.orderBankId = res.body.orders[0].id;
        done();
      });
  });

  it('create bank verification' , function(done){
    this.timeout(60000);
    var dataBankId = {
      bankId : modelSpec.bankAccount.id
    };
    request(app)
      .post('/api/v1/bank/create/verification')
      .set('Authorization', token)
      .send(dataBankId)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal(1, res.body.bankAccountVerifications.length, 'Must exist one account pending to verification');
        modelSpec.bankAccountVerification = res.body.bankAccountVerifications[0];
        done();
      });
  });

  it('confirm bank verification' , function(done){
    this.timeout(60000);
    var confirmBankVerificationData = modelSpec.confirmBankVerificationData();
    request(app)
      .post('/api/v1/bank/confirm/verification')
      .set('Authorization', token)
      .send(confirmBankVerificationData)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal(1, res.body.bankAccountVerifications.length, 'Must exist one account pending to verification');
        modelSpec.bankAccountVerification = res.body.bankAccountVerifications[0];
        done();
      });
  });

  it('debit bank' , function(done){
    this.timeout(60000);
    var debitBankData = modelSpec.debitBankData();
    request(app)
      .post('/api/v1/bank/debit')
      .set('Authorization', token)
      .send(debitBankData)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal(1, res.body.debits.length, 'Must exist one debit bank');
        modelSpec.debitBankResponse = res.body;
        done();
      });
  });

  it('fetch debit' , function(done){
    this.timeout(60000);
    var debitId = modelSpec.debitBankResponse.debits[0].id;
    request(app)
      .get('/api/v1/order/debit/debitId/'+debitId)
      .set('Authorization', token)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal(1, res.body.debits.length, 'Must exist one debit bank');
        modelSpec.debitBankResponse = res.body;
        done();
      });
  });

  it('list customer banks' , function(done){
    this.timeout(60000);

    request(app)
      .get('/api/v1/bank/list/customerId/'+modelSpec.customer.id)
      .set('Authorization', token)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal(1, res.body.bankAccounts.length, 'Must exist one bank account');
        done();
      });
  });

  it('load bank verification' , function(done){
    this.timeout(60000);
    request(app)
      .get('/api/v1/bank/load/verification/verificationId/'+modelSpec.bankAccountVerification.id)
      .set('Authorization', token)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal(1, res.body.bankAccountVerifications.length, 'Must exist one credit card');
        assert.equal('succeeded', res.body.bankAccountVerifications[0].verificationStatus, 'Must be succeeded state');
        done();
      });
  });

  it('prepare bank' , function(done){
    var prepareBankData = modelSpec.prepareBankData();
    this.timeout(60000);
    request(app)
      .post('/api/v1/bank/prepare')
      .set('Authorization', token)
      .send(prepareBankData)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal(1, res.body.bankAccounts.length, 'Must exist one bank account');
        done();
      });
  });

  it('fetch bank' , function(done){
    this.timeout(60000);
    request(app)
      .get('/api/v1/bank/fetch/bankId/'+modelSpec.bankAccount.id)
      .set('Authorization', token)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal(1, res.body.bankAccounts.length, 'Must exist one bank account');
        done();
      });
  });

  it('get user default bank id' , function(done){
    this.timeout(60000);
    request(app)
      .get('/api/v1/bank/default/customerId/'+modelSpec.customer.id)
      .set('Authorization', token)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal(modelSpec.bankAccount.id, res.body, 'bank id is not correct');
        done();
      });
  });

  it('create card' , function(done){
    var cardDetails = modelSpec.cardDetails;
    this.timeout(60000);
    request(app)
      .post('/api/v1/card/create')
      .set('Authorization', token)
      .send(cardDetails)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert(res.body, 'No data response from credit card');
        assert.notEqual(0, res.body.id.length, 'id from credit card is not present');
        modelSpec.creditCard = res.body;
        done();
      });

  });

  it('associate card' , function(done){
    var associateCardData = modelSpec.associateCardData();
    this.timeout(60000);
    request(app)
      .post('/api/v1/card/associate')
      .set('Authorization', token)
      .send(associateCardData)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert(res.body.cards.length === 1, 'The card associate must be one');
        done();
      });
  });

  it('create order card' , function(done){
    this.timeout(60000);
    var order = modelSpec.order();
    request(app)
      .post('/api/v1/order/create')
      .set('Authorization', token)
      .send(order)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert(res.body,'The response must not be null');
        modelSpec.orderId = res.body.orders[0].id;
        done();
      });
  });

  it('debit card' , function(done){
    this.timeout(60000);
    var debitCardData = modelSpec.debitCardData();
    request(app)
      .post('/api/v1/card/debit')
      .set('Authorization', token)
      .send(debitCardData)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal(1, res.body.debits.length, 'Must exist one debit bank');
        done();
      });
  });

  it('list cards' , function(done){
    this.timeout(60000);

    request(app)
      .get('/api/v1/card/list/customerId/'+modelSpec.customer.id)
      .set('Authorization', token)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal(1, res.body.cards.length, 'Must exist one bank account');
        done();
      });
  });

  it('prepare card' , function(done){
    var prepareCardData = modelSpec.prepareCardData();
    this.timeout(60000);
    request(app)
      .post('/api/v1/card/prepare')
      .set('Authorization', token)
      .send(prepareCardData)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal(1, res.body.cards.length, 'Must exist one card');
        done();
      });
  });

  it('fetch card' , function(done){
    this.timeout(60000);
    request(app)
      .get('/api/v1/card/fetch/cardId/'+modelSpec.creditCard.id)
      .set('Authorization', token)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal(1, res.body.cards.length, 'Must exist one card');
        done();
      });
  });

  it('get user default card id' , function(done){
    this.timeout(60000);
    request(app)
      .get('/api/v1/card/default/customerId/'+modelSpec.customer.id)
      .set('Authorization', token)
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal(modelSpec.creditCard.id, res.body, 'bank id is not correct');
        done();
      });
  });

  it('delete bank' , function(done){
    this.timeout(60000);
    request(app)
      .delete('/api/v1/bank/delete')
      .set('Authorization', token)
      .send({bankId : modelSpec.bankAccount.id})
      .expect(200)
      .end(function(err, res) {
        if (err)
          return done(err);
        assert.equal('{}', JSON.stringify(res.body));
        done();
      });
  });
});
