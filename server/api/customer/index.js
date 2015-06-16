/**
 * Created by riclara on 3/5/15.
 */
'use strict';

var express = require('express');
var controller = require('./customer.controller');
var config = require('../../config/environment');
var auth = require('TDCore').authCoreService

var router = express.Router();

router.post('/create', auth.isAuthenticatedServer(config.nodePass.me.token), controller.createCustomer);
router.post('/create/connect', auth.isAuthenticatedServer(config.nodePass.me.token), controller.createConnectAccount);
router.post('/add/tos', auth.isAuthenticatedServer(config.nodePass.me.token), controller.addToSAccount);
router.post('/add/legal', auth.isAuthenticatedServer(config.nodePass.me.token), controller.addLegaInfoAccount);
router.post('/update/connect', auth.isAuthenticatedServer(config.nodePass.me.token), controller.updateAccount);

module.exports = router;
