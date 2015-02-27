/**
 * Created by riclara on 2/11/15.
 */
'use strict';

var app = require('../../../app');
var request = require('supertest');
var assert = require('chai').assert;
var modelSpec = require('./bank.model.spec');
var paymentService = require('../../payment/payment.service');

describe.only('bank.service', function(){
   describe('Prepare user', function (){
        it('Create fake user', function(done){
            var userFake = {firstName:modelSpec.firstName,lastName:modelSpec.lastName};
            request(app)
            .post('/api/v1/user/create')
            .expect(200)
            .send(userFake)
            .end(function(err, res) {
                if (err) return done(err);
                assert(res.body.userId);
                modelSpec.userId = res.body.userId;
                done();
            });
        });

        it('add credentials to fake user', function(done){
            var credentialFake = {userId: modelSpec.userId,email: modelSpec.email,password: modelSpec.password,rememberMe: true};
            request(app)
            .post('/api/v1/auth/local/signup')
            .send(credentialFake)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .end(function(err, res) {
                if (err) return done(err);
                assert(res.body.token);
                modelSpec.token = res.body.token;
                done();
            });
        });

        it('Create fake child to userFake', function(done){
            var userFake = {token:modelSpec.token,firstName:modelSpec.firstName,lastName:modelSpec.lastName, gender:modelSpec.gender};
            request(app)
            .post('/api/v1/user/create')
            .set('Authorization', "Bearer "+modelSpec.token)
            .expect(200)
            .send(userFake)
            .end(function(err, res) {
                if (err) return done(err);
                assert(res.body.userId);
                modelSpec.childId = res.body.userId;
                done();
            });
        });

        it('Create relationFake', function(done){
            var relationFake = {token:modelSpec.token,sourceUserId:modelSpec.userId,targetUserId:modelSpec.childId, type:modelSpec.typeRelation};
            request(app)
            .post('/api/v1/user/relation/create')
            .set('Authorization', "Bearer "+modelSpec.token)
            .expect(200)
            .send(relationFake)
            .end(function(err, res) {
                if (err) return done(err);
                assert(res.body);
                done();
            });
        });
    });

describe('Add method payment', function (){
        this.timeout(30000);

        it('createBank (front)', function (done) {
            var bankDetails = modelSpec.bankDetails();

            paymentService.createBank(bankDetails, function (err, data) {
                if (err) done(err);
                assert.isNotNull(data.id);
                modelSpec.bankId = data.id;
                done();
            });
        });

        it.skip('createBank (back)', function(done){
            var bank = modelSpec.bankDetails();
            request(app)
            .post('/api/v1/payment/bank/create')
            .set('Authorization', "Bearer "+modelSpec.token)
            .expect(200)
            .send(bank)
            .end(function(err, res) {
                if (err) return done(err);
                modelSpec.bankId = data.id;
                done();
            });
        });

    });

  describe('create bank account', function(){
    it('create account', function(done){
      this.timeout(60000);
            request(app)
            .post('/api/v1/payment/bank/create')
            .set('Authorization', "Bearer "+modelSpec.token)
            //.expect(200)
            .send({bankId:modelSpec.bankId})
            .end(function(err, res) {
                if (err) return done(err);

                assert(res.body);

                done();
            });
    });

    it('list bank', function(done){
      this.timeout(60000);
            request(app)
            .get('/api/v1/payment/bank/list')
            .set('Authorization', "Bearer "+modelSpec.token)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                modelSpec.verificationId = res.body.bankAccounts[0].links.bankAccountVerification;
                assert.equal(res.body.bankAccounts.length, 1);
                done();
            });
    });

    it('verify bank fail 1', function(done){
      this.timeout(60000);
        var dataVerify = {
            verificationId: modelSpec.verificationId,
            deposit1: 2,
            deposit2: 2
        };
        request(app)
        .post('/api/v1/payment/bank/verify')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(400)
        .send(dataVerify)
        .end(function(err, res) {
            if (err) return done(err);
            assert.equal(res.body.message, 'Your bank account has not been verified');
            done();
        });
    });

    it('verify bank fail 2', function(done){
      this.timeout(60000);
        var dataVerify = {
            verificationId: modelSpec.verificationId,
            deposit1: 2,
            deposit2: 2
        };
        request(app)
        .post('/api/v1/payment/bank/verify')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(400)
        .send(dataVerify)
        .end(function(err, res) {
            if (err) return done(err);
            assert.equal(res.body.message, 'Your bank account has not been verified');
            done();
        });
    });

    it('verify bank fail 3', function(done){
      this.timeout(60000);
        var dataVerify = {
            verificationId: modelSpec.verificationId,
            deposit1: 2,
            deposit2: 2
        };
        request(app)
        .post('/api/v1/payment/bank/verify')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(400)
        .send(dataVerify)
        .end(function(err, res) {
            if (err) return done(err);
            assert.equal(res.body.message, 'Has exceeded number max to attempts');
            done();
        });
    });

    it('list bank account', function(done){
      this.timeout(60000);
        request(app)
        .get('/api/v1/payment/bank/list')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            assert.equal(res.body.bankAccounts.length, 1);
            done();
        });
    });

    it('delete bank account', function(done){
      this.timeout(60000);
      request(app)
        .get('/api/v1/payment/bank/delete/'+modelSpec.bankId)
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.deepEqual(res.body, {});
          done();
        });
    });

  });

});
