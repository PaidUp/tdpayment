'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/tdpayment-dev',
    options : {
      prefix : 'tdpayment_'
    }
  },

  seedDB: true
};
