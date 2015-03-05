/**
 * Created by riclara on 3/5/15.
 */
'use strict';

var express = require('express');
var controller = require('./customer.controller');
var config = require('../../config/environment');
var auth = require('TDCore').auth;

var router = express.Router();

router.post('/create', auth.isAuthenticatedServer(config.nodePass.me.token), controller.createCustomer);

module.exports = router;
