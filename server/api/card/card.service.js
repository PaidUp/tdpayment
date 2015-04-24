'use strict';

var config = require('../../config/environment');
var paymentAdapter = require(config.payment.adapter);

/**
 * Create credit card in balanced payment
 * @param cardDetails
 * @param cb
 */
function createCard (cardDetails, cb) {
  paymentAdapter.createCard(cardDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function  associateCard (customerId, cardId, cb) {
  paymentAdapter.associateCard(customerId, cardId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function debitCard (debitCardData, cb) {
  paymentAdapter.debitCard(debitCardData.cardId, debitCardData.amount, debitCardData.description, debitCardData.appearsOnStatementAs, debitCardData.customerId, debitCardData.providerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function listCards(params, cb) {
  paymentAdapter.listCards(params.customerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function prepareCard (params, cb) {
  paymentAdapter.fetchCard(params.cardId, function(err, creditCard){
    if(err) return cb(err);
    if(creditCard.cards[0].links.customer === null) {
      associateCard(params.userId, params.cardId, function (err, data) {
        if(err) return cb(err);
        return cb(null, creditCard);
      });
    }
    else {
      return cb(null, creditCard);
    }
  });
}

function fetchCard (customerId, cardId, cb){
  paymentAdapter.fetchCard(customerId, cardId, function(err, creditCard){
    if(err) return cb(err);
    return cb(null, creditCard);
  });
}

function getUserDefaultCardId (params, cb) {
  listCards(params, function(err, data){
    if(err) return cb(err);
    if(data.cards.length == 0) {
      // error
      return cb({name: 'not-available-payment'}, null);
    }
    var card = data.cards[0];
    return cb(null, card.id);
  });
};

module.exports = {
  createCard :createCard,
  associateCard : associateCard,
  debitCard : debitCard,
  listCards : listCards,
  prepareCard : prepareCard,
  fetchCard : fetchCard,
  getUserDefaultCardId : getUserDefaultCardId
};
