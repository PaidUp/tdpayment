/**
 * Created by riclara on 3/5/15.
 */

'use strict';

var app = require('../app');
var request = require('supertest');
var assert = require('chai').assert;
var modelSpec = require('./payment.model.spec');

var token = require('../config/environment').nodePass.me.token;

describe.skip('test customer controller' , function(){
  it('create customer' , function(done){
    this.timeout(60000);
    var user = modelSpec.user;
    console.log(user);

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
        modelSpec.userId = res.body.userId;
        done();
      });
  });
});
