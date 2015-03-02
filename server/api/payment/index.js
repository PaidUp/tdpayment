'use strict';

var express = require('express');
var controller = require('./payment.controller');
var router = express.Router();

router.post('/createCustomer', controller.createCustomer);
router.post('/createCard', controller.createCard);
router.post('/associateCard', controller.associateCard);
router.post('/createBank', controller.createBank);
router.post('/associateBank', controller.associateBank);
router.post('/createOrder', controller.createOrder);
router.post('/debitCard', controller.debitCard);
router.post('/debitBank', controller.debitBank);
router.post('/listCustomerBanks', controller.listCustomerBanks);
router.post('/listCards', controller.listCards);
router.post('/createBankVerification', controller.createBankVerification);
router.post('/loadBankVerification', controller.loadBankVerification);
router.post('/deleteBankAccount', controller.deleteBankAccount);
router.post('/confirmBankVerification', controller.confirmBankVerification);
router.post('/updateOrderDescription', controller.updateOrderDescription);
router.post('/createOrder', controller.createOrder);
router.post('/listBanks', controller.listBanks);
router.post('/prepareCard', controller.prepareCard);
router.post('/prepareBank', controller.prepareBank);
router.post('/fetchBank', controller.fetchBank);
router.post('/fetchCard', controller.fetchCard);
router.post('/fetchDebit', controller.fetchDebit);
router.post('/getUserDefaultBankId', controller.getUserDefaultBankId);
router.post('/getUserDefaultCardId', controller.getUserDefaultCardId);

module.exports = router;
