'use strict';

var config = require('../../config/environment');
var camelize = require('camelize');
var stripeApi = require('stripe')(config.payment.stripe.api);

function generateToken(data, cb){
  stripeApi.tokens.create(data).then(
    function(result) {
      cb(null, result.id);
    },
    function(err) {
      cb(err);
    }
  );
};

function createCustomer(customer, cb){
  var stripeCustomer = {
    description : customer.name,
    mail : customer.mail,
    metadata : customer.meta
  }
  stripeApi.customers.create(stripeCustomer, function(err, customer) {
    if(err) return cb(err);
    cb(null , camelize(customer));
  });
};

function fetchCustomer(customerId, cb) {
  stripeApi.customers.retrieve(customerId,function(err, customer) {
      if(err) return cb(err);
      cb(null , camelize(customer));
    }
  );
}

function createCard(cardDetails, cb) {
  //without funcionality from backend.
  return cb(null, {'stripe':'creat'});
}
function associateCard(customerId, cardId, cb) {
  stripeApi.customers.createSource(customerId,{source: cardId}, function(err, card) {
      if (err) return cb(err);
      if(hasError(card)) return cb(handleErrors(card));
      return cb(null, camelize(card));
    }
  );
}

function createBank(bankDetails, cb) {
  var bankAccount = {
    bank_account: {
      country: bankDetails.country,
      routing_number: bankDetails.routing_number,
      account_number: bankDetails.account_number
    }
  };
  stripeApi.tokens.create(bankAccount, function(err, token) {
    if(err) return cb(err);
    return cb(null , token);
  });
}

/*
//url/bank_accounts/BA4rlGQ3rtmDL1Mal7ZWWdeZ \
//-d "customer=/customers/CU1FzaYMLLAEWG8JvB3VAFwh
function associateBank(customerId, cardId, cb) {
  httpRequest("PUT", {customer:'/customers/' + customerId}, '/bank_accounts/'+cardId, function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}

//url/customers/{customers.id}/bank_accounts \
function listCustomerBanks(customerId, cb) {
  httpRequest("GET", null, '/customers/' + customerId + '/bank_accounts', function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}
*/
function listCards(customerId, cb) {
  stripeApi.customers.listCards(customerId, function(err, cards) {
    if (err) return cb(err);
    if(hasError(cards)) return cb(handleErrors(cards));
    return cb(null, camelize(cards));
  });
}

function fetchCard(customerId,cardId, cb) {
  //TODO: send customerId in request.
  stripeApi.customers.retrieveCard(customerId,cardId,function(err, card) {
      if (err) return cb(err);
      if(hasError(card)) return cb(handleErrors(card));
      return cb(null, camelize(card));
    }
  );
}

/*
//url/bank_accounts/CC506bcUEIw5mc2iaRELcXHv \
function fetchBank(bankId, cb) {
  httpRequest("GET", null, '/bank_accounts/' + bankId, function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}

//url/customers/CU40AyvBB6ny9u3oelCwyc3C/orders \
//-d "description=Order #12341234"
function createOrder(merchantCustomerId, description, cb) {
  httpRequest("POST", {description: description}, '/customers/'+merchantCustomerId+'/orders', function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    if (data.errors) {
      return cb(data.errors);
    }
    return cb(null, camelize(data));
  });
}
*/
function debitCard(cardId, amount, description, appearsOnStatementAs, orderId, cb) {
  //TODO: Do question about description, appearsOnStatementAs and orderId
  stripeApi.charges.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    source: cardId, // obtained with Stripe.js
    description: description +' - '+ appearsOnStatementAs +' - '+ orderId
  }, function(err, charge) {
    if (err) return cb(err);
    if(hasError(charge)) return cb(handleErrors(charge));
    return cb(null, camelize(charge));
  });
}
/*
url/bank_accounts/BA4inLpYaYvBmxsWoxQFPoCQ/debits \
//-d "amount=5000" \
//-d "order=/orders/OR49gqHygz3Idp1jezxu2esg"
function debitBank(bankId, amount, description, appearsOnStatementAs, orderId, cb) {
  var params = {
    amount: Math.round(amount * 100),
    description: description,
    order: "/orders/"+orderId,
    appears_on_statement_as: appearsOnStatementAs
  };
  httpRequest("POST", params, '/bank_accounts/'+bankId+'/debits', function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}

url/debits/{debit_id} \
function fetchDebit(debitId, cb) {
  httpRequest("GET",
    {}, '/debits/'+debitId, function(err, data){
      if (err) return cb(err);
      if(hasError(data)) return cb(handleErrors(data));
      return cb(null, camelize(data));
    });
}

//url/orders/OR5sl2RJVnbwEf45nq5eATdz \
//-d "description=New description for order" \
//-d "meta[product.id]=1234567890" \
//-d "meta[anykey]=valuegoeshere"
function updateOrderDescription(orderId, description, cb) {
  httpRequest("PUT", {description: description}, '/orders/'+orderId, function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}

//curl https://api.balancedpayments.com/bank_accounts/BA31t1BZ0fBcAvdkEPJe6vZP/verifications \
function createBankVerification(bankId, cb) {
  httpRequest("POST", null, '/bank_accounts/'+ bankId +'/verifications', function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}


//curl https://api.balancedpayments.com/verifications/BZ3mEk8cx3CmgJ62Q01nV6Zq \
//-d "amount_1=1" \
//-d "amount_2=1"
function loadBankVerification(verificationId, cb) {
  httpRequest("GET", null, '/verifications/'+ verificationId, function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}


//url/verifications/BZ3mEk8cx3CmgJ62Q01nV6Zq \
//-d "amount_1=1" \
//-d "amount_2=1"
function confirmBankVerification(verificationId, amount1, amount2, cb) {
  httpRequest("PUT", {amount_1: amount1, amount_2: amount2}, '/verifications/'+ verificationId, function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}


//url/bank_accounts/BA7iosgWjWaeqTsv3XMux19S \
function deleteBankAccount(bankId, cb){
  httpRequest("DELETE", {},'/bank_accounts/'+bankId, function(err, data){
    if(err)
      return cb(err);
    if(hasError(data))
      return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
};
*/
function listBanks(customerId, cb) {
  return cb(null, []);
}

function hasError(response) {
  if(response.errors) {
    return true;
  }
  if(response[0]){
    if(response[0].status_code !== 200){
      return true;
    }
  }
  return false;
}

function handleErrors(response) {
  return response.errors;
}

module.exports = {
  generateToken : generateToken,
  createCustomer : createCustomer,
  fetchCustomer : fetchCustomer,
  associateCard : associateCard,
  listCards : listCards,
  fetchCard : fetchCard,
  debitCard : debitCard,
  listBanks : listBanks
}
