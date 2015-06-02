/**
 * Created by riclara on 3/5/15.
 */
'use strict';

var express = require('express');
var controller = require('./order.controller.js');
var config = require('../../config/environment');
var auth = require('TDCore').authCoreService;

var router = express.Router();

router.post('/create', auth.isAuthenticatedServer(config.nodePass.me.token), controller.createOrder);
router.post('/update/description', auth.isAuthenticatedServer(config.nodePass.me.token), controller.updateOrderDescription);
router.get('/debit/debitId/:debitId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.fetchDebit);

module.exports = router;
