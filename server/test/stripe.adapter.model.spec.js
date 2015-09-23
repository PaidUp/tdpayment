/**
 * Created by riclara on 4/8/15.
 */

'use strict';

var faker = require('faker');

var data = {
    tokenData: {
      card: {
        "number": '4242424242424242',
        "exp_month": 12,
        "exp_year": 2016,
        "cvc": '123'
      }
    },
    cardToken: '',
    cardToken2: '',
    cardId: '',
    amount: 100,
    description: 'description',
    appearsOnStatementAs: 'appearsOnStatementAs',
    orderId: 'orderId',
    customerData: {
      customerId: '',
      name: faker.name.firstName() + ' ' + faker.name.lastName(),
      email: faker.internet.email(),
      meta: {
        id: faker.finance.account()
      }
    },
    customerRes: {},
    accountDetails: {
      email: faker.internet.email(),
      country: 'US'
    },
    account: {
      id: ''
    },
    bankDetails: {
      country: 'US',
      routingNumber: '110000000',
      accountNumber: '000123456789'
    },
    tokenDataFail: {
      card: {
        "number": '4100000000000019',//https://stripe.com/docs/testing
        "exp_month": 7,
        "exp_year": 2016,
        "cvc": '123'
      }
    },
    cardTokenFail: '',
    cardIdFail: '',
  }

  ;

module.exports = data;
