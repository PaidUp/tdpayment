'use strict';

var express = require('express');
var controller = require('./payment.controller');
var config = require('../../config/environment');
var auth = require('TDCore').auth;

var router = express.Router();

router.post('/createCustomer', auth.isAuthenticatedServer(config.nodePass.me.token), controller.createCustomer);
router.post('/createCard', auth.isAuthenticatedServer(config.nodePass.me.token), controller.createCard);
router.post('/associateCard', auth.isAuthenticatedServer(config.nodePass.me.token), controller.associateCard);
router.post('/createBank', auth.isAuthenticatedServer(config.nodePass.me.token), controller.createBank);
router.post('/associateBank', auth.isAuthenticatedServer(config.nodePass.me.token), controller.associateBank);
router.post('/createOrder', auth.isAuthenticatedServer(config.nodePass.me.token), controller.createOrder);
router.post('/debitCard', auth.isAuthenticatedServer(config.nodePass.me.token), controller.debitCard);
router.post('/debitBank', auth.isAuthenticatedServer(config.nodePass.me.token), controller.debitBank);
router.get('/listCustomerBanks/customerId/:customerId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.listCustomerBanks);
router.get('/listCards/customerId/:customerId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.listCards);
router.post('/createBankVerification', auth.isAuthenticatedServer(config.nodePass.me.token), controller.createBankVerification);
router.get('/loadBankVerification/verificationId/:verificationId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.loadBankVerification);
router.delete('/deleteBankAccount', auth.isAuthenticatedServer(config.nodePass.me.token), controller.deleteBankAccount);
router.post('/confirmBankVerification', auth.isAuthenticatedServer(config.nodePass.me.token), controller.confirmBankVerification);
router.post('/updateOrderDescription', auth.isAuthenticatedServer(config.nodePass.me.token), controller.updateOrderDescription);
router.get('/listBanks/customerId/:customerId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.listBanks);
router.post('/prepareCard', auth.isAuthenticatedServer(config.nodePass.me.token), controller.prepareCard);
router.post('/prepareBank', auth.isAuthenticatedServer(config.nodePass.me.token), controller.prepareBank);
router.get('/fetchBank/bankId/:bankId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.fetchBank);
router.get('/fetchCard/cardId/:cardId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.fetchCard);
router.get('/fetchDebit', auth.isAuthenticatedServer(config.nodePass.me.token), controller.fetchDebit);
router.get('/getUserDefaultBankId/customerId/:customerId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.getUserDefaultBankId);
router.get('/getUserDefaultCardId/customerId/:customerId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.getUserDefaultCardId);

module.exports = router;
