'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/tdpayment-test',
    options: {
      prefix: 'tdpayment_'
    }
  },
  payment: {
    stripe: {
      api: "sk_test_i1WgQIKn3mXx4GP5B8Yh79U1"
    }
  },
  nodePass: {
    me:{
      token : 'TDPaymentToken-CHANGE-ME!'
    }
  }
};
