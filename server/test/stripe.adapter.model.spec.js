/**
 * Created by riclara on 4/8/15.
 */

'use strict';

var faker = require('faker');

var data = {
  tokenData : {
    card: {
      "number": '4242424242424242',
      "exp_month": 12,
      "exp_year": 2016,
      "cvc": '123'
    }
  },
  customerData : {
    name : faker.name.firstName() + ' '+faker.name.lastName(),
    email : faker.internet.email(),
    meta : {
      id : faker.finance.account()
    }
  },
  customerRes : {}

};

module.exports = data;
