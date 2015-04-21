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
  cardToken:'',
  cardToken2:'',
  cardId:'',
  amount:245,
  description:'description',
  appearsOnStatementAs:'appearsOnStatementAs',
  orderId:'orderId',
  customerData : {
    customerId:'',
    name : faker.name.firstName() + ' '+faker.name.lastName(),
    email : faker.internet.email(),
    meta : {
      id : faker.finance.account()
    }
  },
  customerRes : {},
  accountDetails : {email : faker.internet.email(),
                    country: 'US'},
  account : {},
  bankDetails : {
  country: 'US',
  routing_number: '110000000',
  account_number: '000123456789',
}}

;

module.exports = data;
