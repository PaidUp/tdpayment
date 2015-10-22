/**
 * Created by riclara on 3/5/15.
 */

 var config = require('../../config/environment');
 var paymentAdapter = require(config.payment.adapter);

function createBank (bankDetails, cb) {
  paymentAdapter.createBank(bankDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function associateBank (customerId, bankId, cb) {
  paymentAdapter.associateBank(customerId, bankId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function debitBank (debitBankData, cb) {
  paymentAdapter.debitBank(debitBankData.bankId, debitBankData.amount, debitBankData.description, debitBankData.appearsOnStatementAs, debitBankData.orderId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function associateBank (customerId, token, cb) {
  paymentAdapter.associateBank(customerId, token, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function listCustomerBanks (customerId, cb) {
  paymentAdapter.listBanks(customerId, function(err, data){
    if(err) {
      return cb(err);
    }else{
      return cb(null, data);
    }
  });
}

function createBankVerification (params, cb) {
  paymentAdapter.createBankVerification(params.bankId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function loadBankVerification (params, cb) {
  paymentAdapter.loadBankVerification(params.verificationId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function deleteBankAccount (bankId, cb) {
  paymentAdapter.deleteBankAccount(bankId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function confirmBankVerification (params, cb) {
  paymentAdapter.confirmBankVerification(params.customerId, params.bankId, params.amount1, params.amount2, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function listBanks(params, cb) {
  paymentAdapter.listBanks(params.customerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function prepareBank (params, cb) {
  paymentAdapter.fetchBank(params.bankId, function(err, bank){
    if(bank.bankAccounts[0].links.customer === null) {
      associateBank(params.userId, params.bankId, function (err, data) {
        if(err) return cb(err);
          return cb(null, bank);
      });
    }
    else {
      return cb(null, bank);
    }
  });
}

function fetchBank (bankId, cb){
  paymentAdapter.fetchBank(bankId, function(err, bank){
    if(err) return cb(err);
    return cb(null, bank);
  });
}

function getUserDefaultBankId (params, cb) {
  // Check bank accounts
  listBanks(params, function(err, data){
    if(err) return cb(err);
    if(data.bankAccounts.length == 0) {
      // error
      return cb({name: 'not-available-payment'}, null);
    }
    var bank;
    for (var i = 0; i < data.bankAccounts.length; i++) {
      bank = data.bankAccounts[i];
      if(bank.state == 'succeeded') {
        return cb(null, bank.id);
      }
    }
    return cb({name: 'not-bank-verified'}, bank.id);
  });
}

function addBankToAccount (accountId, bankDetails, cb) {
  paymentAdapter.addBankToAccount(accountId, bankDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

module.exports = {
  createBank : createBank,
  associateBank : associateBank,
  debitBank : debitBank,
  associateBank : associateBank,
  listCustomerBanks : listCustomerBanks,
  createBankVerification : createBankVerification,
  loadBankVerification : loadBankVerification,
  deleteBankAccount :deleteBankAccount,
  confirmBankVerification : confirmBankVerification,
  listBanks : listBanks,
  prepareBank : prepareBank,
  fetchBank : fetchBank,
  getUserDefaultBankId : getUserDefaultBankId,
  addBankToAccount : addBankToAccount
};
