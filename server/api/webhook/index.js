'use strict';

var express = require('express');
var controller = require('./webhook.controller.js');
var config = require('../../config/environment');
var auth = require('TDCore').authCoreService;

var router = express.Router();

router.post('/', auth.isAuthenticatedServer(config.nodePass.me.token), controller.wone);


module.exports = router;
