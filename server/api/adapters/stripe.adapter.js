'use strict'

var config = require('../../config/environment')
var https = require('https')
var querystring = require('querystring')
var camelize = require('camelize')
var stripeApi = require('stripe')(config.payment.stripe.api)
var stripeToken = config.payment.stripe.api
var urlencode = require('urlencode')
var async = require('async');

function httpRequest(method, bodyRequest, path, stripeAccount, cb) {
  var options = {
    host: 'api.stripe.com',
    port: 443,
    method: method,
    path: path,
    headers: {
      'Authorization': 'Basic ' + new Buffer(stripeToken + ':' + '').toString('base64'),
      'Accept': 'application/vnd.api+json;revision=1.1',
      'Content-Length': bodyRequest.length || 0,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  if (stripeAccount) {
    options.headers['Stripe-Account'] = stripeAccount;
  }
  var bodyRequest = querystring.stringify(bodyRequest)
  var body = ''
  var request = https.request(options, function (res) {
    res.on('data', function (data) {
      body += data
    })
    res.on('end', function () {
      var pbody = {}
      if (body !== '') {
        pbody = JSON.parse(body)
      }
      return cb(null, pbody)
    })
    res.on('error', function (e) {
      return (e, null)
    })
  })
  request.write(bodyRequest)
  request.end()
}

function generateToken(data, cb) {
  stripeApi.tokens.create(data).then(
    function (result) {
      cb(null, result.id)
    },
    function (err) {
      cb(err)
    }
  )
}

function createCustomer(customer, cb) {
  var stripeCustomer = {
    description: customer.name,
    email: customer.email,
    metadata: customer.meta
  }
  stripeApi.customers.create(stripeCustomer, function (err, customer) {
    if (err) return cb(err)
    cb(null, camelize(customer))
  })
}

function fetchCustomer(customerId, cb) {
  stripeApi.customers.retrieve(customerId, function (err, customer) {
    if (err) return cb(err)
    cb(null, camelize(customer))
  }
  )
}

function createCard(cardDetails, cb) {
  generateToken(cardDetails, function (err, data) {
    if (err) return cb(err)
    cb(null, data)
  })
}

function associateCard(customerId, cardId, cb) {
  stripeApi.customers.createSource(customerId, { source: cardId }, function (err, card) {
    if (err) return cb(err)
    if (hasError(card)) return cb(handleErrors(card))
    return cb(null, camelize(card))
  }
  )
}

function updateCustomer(customer, data, cb) {
  stripeApi.customers.update(customer, data, function (err, customer) {
    if (err) return cb(err)
    cb(null, camelize(customer))
  })
}

function createBank(bankDetails, cb) {
  var bankAccount = {
    bank_account: {
      country: bankDetails.country,
      routing_number: bankDetails.routing_number,
      account_number: bankDetails.account_number
    }
  }
  stripeApi.tokens.create(bankAccount, function (err, token) {
    if (err) return cb(err)

    httpRequest('POST', { source: token.id }, '/v1/customers/' + urlencode(bankDetails.customerId) + '/sources', null, function (err1, data) {
      if (err1) return cb(err1)

      return cb(null, data)
    })
  })
}

function associateBank(customerId, token, cb) {
  httpRequest('POST', { source: token }, '/v1/customers/' + urlencode(customerId) + '/sources', null, function (err1, data) {
    if (err1) return cb(err1)
    if (data.error) return cb(data)
    return cb(null, data)
  })
}

function listCards(customerId, cb) {
  stripeApi.customers.listCards(customerId, function (err, cards) {
    if (err) return cb(err)
    if (hasError(cards)) return cb(handleErrors(cards))
    return cb(null, camelize(cards))
  })
}

function fetchCard(customerId, cardId, cb) {
  // TODO: send customerId in request.
  stripeApi.customers.retrieveCard(customerId, cardId, function (err, card) {
    if (err) return cb(err)
    if (hasError(card)) return cb(handleErrors(card))
    return cb(null, camelize(card))
  })
}

function debitCard(cardId, amount, description, appearsOnStatementAs, customerId, providerId, fee, meta, cb) {
  fee = parseFloat(fee)
  amount = parseFloat(amount)
  // TODO: Do question about description, appearsOnStatementAs and orderId
  stripeApi.charges.create({
    amount: Math.round(amount * 100),
    currency: 'usd',
    source: cardId, // cardId
    customer: customerId, // cus_xx
    destination: providerId, // acc_xx
    description: description,
    application_fee: Math.round(calculateApplicationFee(amount, fee) * 100),
    metadata: meta
  }, function (err, charge) {
    if (err) return cb(err)
    if (hasError(charge)) return cb(handleErrors(charge))
    return cb(null, camelize(charge))
  })
}

function debitCardv2(cardId, amount, description, appearsOnStatementAs, customerId, providerId, fee, meta, statementDescriptor, cb) {
  fee = parseFloat(fee)
  amount = parseFloat(amount)
  // TODO: Do question about description, appearsOnStatementAs and orderId
  let params = {
    amount: Math.round(amount * 100),
    currency: 'usd',
    source: cardId, // cardId
    customer: customerId, // cus_xx
    destination: providerId, // acc_xx
    description: description,
    application_fee: Math.round(fee * 100),
    metadata: meta,
  }
  if (statementDescriptor && statementDescriptor.length > 0) {
    params.statement_descriptor = statementDescriptor;
  }
  stripeApi.charges.create(params, function (err, charge) {
    if (err) return cb(err)
    if (hasError(charge)) return cb(handleErrors(charge))
    return cb(null, camelize(charge))
  })
}

function calculateApplicationFee(amount, fee) {
  if (!config.payment.CSPayFee) {
    fee += (amount * (config.payment.stripe.feeStripePercent / 100)) + config.payment.stripe.feeStripeBase
  }
  return parseFloat(Math.ceil(fee * 100) / 100).toFixed(2)
}

function debitBank(bankId, amount, description, appearsOnStatementAs, orderId, cb) {
  var params = {
    amount: Math.round(amount * 100),
    description: description,
    order: '/orders/' + orderId,
    appears_on_statement_as: appearsOnStatementAs
  }
  httpRequest('POST', params, '/bank_accounts/' + bankId + '/debits', null, function (err, data) {
    if (err) return cb(err)
    if (hasError(data)) return cb(handleErrors(data))
    return cb(null, camelize(data))
  })
}

function confirmBankVerification(customerId, bankId, amount1, amount2, cb) {
  var amounts = [amount1, amount2]
  httpRequest('POST', { 'amounts[]': amounts }, '/v1/customers/' + urlencode(customerId) + '/sources/' + urlencode(bankId) + '/verify', null, function (err, data) {
    if (err) {
      return cb(err)
    }
    if (data.error) {
      return cb(data)
    }
    return cb(null, camelize(data))
  })
}

function listBanks(customerId, cb) {
  stripeApi.customers.listSources(customerId, { limit: 10, object: 'bank_account' }, function (err, bankAccounts) {
    if (err) return cb(err)
    return cb(null, bankAccounts)
  })
}

function fetchBank(customerId, bankId, cb) {
  stripeApi.customers.retrieveSource(customerId, bankId, function (err, bank) {
    if (err) return cb(err)
    if (hasError(bank)) return cb(handleErrors(bank))
    return cb(null, camelize(bank))
  })
}

function hasError(response) {
  if (response.errors) {
    return true
  }
  if (response[0]) {
    if (response[0].status_code !== 200) {
      return true
    }
  }
  return false
}

function createAccount(accountDetails, cb) {
  stripeApi.accounts.create({
    debit_negative_balances: true,
    country: accountDetails.country,
    email: accountDetails.email,
    type: accountDetails.type
  }, function (err, account) {
    if (err) return cb(err)

    return cb(false, account)
  })
}

function retrieveAccount(accountId, cb) {
  stripeApi.accounts.retrieve(accountId, function (err, accountDetails) {
    if (err) return cb(err)
    return cb(false, accountDetails)
  })
}

function addBankToAccount(accountId, bankDetails, cb) {
  stripeApi.accounts.update(accountId, {
    bank_account: {
      country: bankDetails.country,
      routing_number: bankDetails.routingNumber,
      account_number: bankDetails.accountNumber
    }
  }, function (err, data) {
    if (err) return cb(err)
    return cb(false, data)
  })
}

function addToSAccount(dataToS, cb) {
  stripeApi.accounts.update(dataToS.accountId,
    {
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: dataToS.ip // Assumes you're not using a proxy
      }
    }, function (err, data) {
      if (err) return cb(err)
      return cb(null, data.tos_acceptance)
    })
}

function addLegaInfoAccount(dataLegal, cb) {
  stripeApi.accounts.update(dataLegal.accountId,
    {
      legal_entity: {
        first_name: dataLegal.firstName,
        last_name: dataLegal.lastName,
        dob: {
          day: dataLegal.day,
          month: dataLegal.month,
          year: dataLegal.year
        },
        type: dataLegal.type, // 'individual' or 'company'
        business_name: dataLegal.businessName,
        ssn_last_4: dataLegal.last4,
        business_tax_id: dataLegal.EIN || '',
        personal_id_number: dataLegal.personalIdNumber,
        address: {
          line1: dataLegal.line1,
          line2: dataLegal.line2,
          city: dataLegal.city,
          state: dataLegal.state,
          postal_code: dataLegal.postalCode,
          country: dataLegal.country
        }
      }
    }, function (err, data) {
      if (err) return cb(err)
      return cb(null, data.legal_entity)
    })
}

function updateAccount(accountId, dataUpdate, cb) {
  stripeApi.accounts.update(accountId, dataUpdate, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function getTransfers(stripeAccount, filter, cb) {
  let externalAccounts = {}
  stripeApi.payouts.list(filter, { stripe_account: stripeAccount }, function (err, payouts) {
    // getBalance({connectAccount:filter, transferId: data.id}, function (err, data) {
    // console.log('err', err)
    // })
    if (err) return cb(err)
    async.eachSeries(payouts.data, function iteratee(item, callback) {
      if (externalAccounts[item.destination]) {
        item['bank_name'] = externalAccounts[item.destination]
        callback(); // if many items are cached, you'll overflow
      } else {
        stripeApi.accounts.retrieveExternalAccount(
          stripeAccount,
          item.destination,
          function (err, external_account) {
            if(external_account){
              externalAccounts[item.destination] = external_account.bank_name
              item['bank_name'] = external_account.bank_name
            }
            callback();
          }
        )
      }
    }, function done() {
      return cb(null, payouts)
    });
  })
}

function balanceHistory(filter, balanceTransaction, cb) {
  stripeApi.balance.retrieveTransaction(balanceTransaction, { stripe_account: filter }, function (err, balanceTransaction) {
    if (err) return cb(err)
    return cb(null, balanceTransaction)
  })
}

function getBalance(connectAccountId, transferId, cb) {
  stripeApi.balance.listTransactions({ limit: 100, payout: transferId }, { stripe_account: connectAccountId }, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function getChargesList(filter, cb) {
  stripeApi.charges.list({ limit: 100 }, { stripe_account: filter }, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function getDepositCharge(paymentId, accountId, cb) {
  httpRequest('GET', {}, '/v1/payments/' + urlencode(paymentId), urlencode(accountId), function (err, data) {
    if (err) return cb(err)
    if (data.error) return cb(data)
    stripeApi.transfers.retrieve(
      data.source_transfer,
      function (err, transfer) {
        if (err) return cb(err)
        stripeApi.charges.retrieve(
          transfer.source_transaction,
          function (err, charge) {
            if (err) return cb(err)
            cb(null, charge);
          }
        );
      }
    );
  })
}

function getDepositChargeRefund(paymentIdr, accountId, cb) {
  stripeApi.refunds.retrieve(
    paymentIdr, { stripe_account: accountId },
    function (err, refund) {
      if (err) return cb(err)
      httpRequest('GET', {}, '/v1/payments/' + urlencode(refund.charge), urlencode(accountId), function (err, data) {
        if (err) return cb(err)
        if (data.error) return cb(data)
        stripeApi.transfers.retrieve(
          data.source_transfer,
          function (err, transfer) {
            if (err) return cb(err)
            stripeApi.charges.retrieve(
              transfer.source_transaction,
              function (err, charge) {
                if (err) return cb(err)
                cb(null, charge);
              }
            );
          }
        );
      })
    }
  );


}

function refund(chargeId, reason, amount, cb) {
  let params = {
    charge: chargeId,
    metadata: { comment: reason },
    refund_application_fee: true,
    reverse_transfer: true
  }
  if (amount) {
    params['amount'] = Math.trunc(amount * 100);
  }
  stripeApi.refunds.create(params, function (err, refund) {
    if (err) {
      return cb(err)
    } else {
      return cb(null, refund)
    }
  });
}

function retrieveTransfer(transferId, cb) {
  stripeApi.transfers.retrieve(
    transferId,
    function (err, transfer) {
      if (err) {
        return cb(err)
      } else {
        return cb(null, transfer)
      }
    })
}

function deleteCard(customerId, cardId, cb){
  stripeApi.customers.deleteCard(
    customerId,
    cardId,
    function(err, confirmation) {
      if(err){
        return cb(err);
      }
      cb(null, confirmation);
    }
  );
}

function deleteBank(customerId, bankId, cb){
  stripeApi.customers.deleteSource(
    customerId,
    bankId,
    function(err, confirmation) {
      if(err){
        return cb(err);
      }
      cb(null, confirmation);
    }
  );
}

function handleErrors(response) {
  return response.errors
}

module.exports = {
  generateToken: generateToken,
  createCustomer: createCustomer,
  fetchCustomer: fetchCustomer,
  associateCard: associateCard,
  listCards: listCards,
  fetchCard: fetchCard,
  debitCard: debitCard,
  debitCardv2: debitCardv2,
  debitBank: debitBank,
  listBanks: listBanks,
  createBank: createBank,
  createAccount: createAccount,
  addBankToAccount: addBankToAccount,
  createCard: createCard,
  addToSAccount: addToSAccount,
  addLegaInfoAccount: addLegaInfoAccount,
  updateAccount: updateAccount,
  updateCustomer: updateCustomer,
  associateBank: associateBank,
  confirmBankVerification: confirmBankVerification,
  fetchBank: fetchBank,
  getTransfers: getTransfers,
  getBalance: getBalance,
  getChargesList: getChargesList,
  retrieveAccount: retrieveAccount,
  balanceHistory: balanceHistory,
  getDepositCharge: getDepositCharge,
  getDepositChargeRefund: getDepositChargeRefund,
  refund: refund,
  retrieveTransfer: retrieveTransfer,
  deleteCard: deleteCard,
  deleteBank, debitBank
}
