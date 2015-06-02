/**
 * Created by riclara on 3/5/15.
 */

'use strict';

var express = require('express');
var controller = require('./bank.controller');
var config = require('../../config/environment');
var auth = require('TDCore').authCoreService;

var router = express.Router();

router.post('/create', auth.isAuthenticatedServer(config.nodePass.me.token), controller.createBank);
router.post('/associate', auth.isAuthenticatedServer(config.nodePass.me.token), controller.associateBank);
router.post('/debit', auth.isAuthenticatedServer(config.nodePass.me.token), controller.debitBank);
router.get('/list/customerId/:customerId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.listCustomerBanks);
router.post('/create/verification', auth.isAuthenticatedServer(config.nodePass.me.token), controller.createBankVerification);
router.get('/load/verification/verificationId/:verificationId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.loadBankVerification);
router.delete('/delete', auth.isAuthenticatedServer(config.nodePass.me.token), controller.deleteBankAccount);
router.post('/confirm/verification', auth.isAuthenticatedServer(config.nodePass.me.token), controller.confirmBankVerification);
//router.get('/list/customerId/:customerId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.listBanks);
router.post('/prepare', auth.isAuthenticatedServer(config.nodePass.me.token), controller.prepareBank);
router.get('/fetch/bankId/:bankId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.fetchBank);
router.get('/default/customerId/:customerId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.getUserDefaultBankId);

router.post('/create/connect', auth.isAuthenticatedServer(config.nodePass.me.token), controller.addBankToAccount);

module.exports = router;

