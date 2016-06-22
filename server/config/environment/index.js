'use strict'

var path = require('path')
var _ = require('lodash')

function requiredProcessEnv (name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9005,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'tdpayment-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    },
    prefix: 'tdpayment_'
  },
  payment: {
    adapter: path.normalize(__dirname + '/../../..') + '/server/api/adapters/stripe.adapter',
    stripe: {
      api: 'sk_test_9AioI4XzoZbMuInmqEAZukPr',
      feeStripePercent: 2.9,
      feeStripeBase: 0.3,
      feeApplication: 5
    },
    balanced: {
      api: 'ak-test-p8Ob9vp9GnqWNwFf6CeLLokeQsf76RIe',
      marketplace: 'TEST-MP2OaM2stYkoWBlGFd0M8YV7',
      appearsOnStatementAs: 'Conv. Select'
    },
    CSPayFee: false
  },

  nodePass: {
    me: {
      token: 'TDPaymentToken-CHANGE-ME!'
    },
    Loan: {
      token: 'nodeLoanPass'
    },
    User: {
      token: 'nodeUserPass'
    },
    Payment: {
      token: 'nodePaymentPass'
    },
    Crowdfunding: {
      token: 'nodeCrowdfundingPass'
    },
    Angular: {
      token: 'nodeAngularPass'
    }
  }

}

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {})
