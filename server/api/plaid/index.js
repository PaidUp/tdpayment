'use strict'

var express = require('express')
var controller = require('./plaid.controller.js')
var config = require('../../config/environment')
var auth = require('TDCore').authCoreService

var router = express.Router()

router.post('/authenticate', auth.isAuthenticatedServer(config.nodePass.me.token), controller.authenticate)

module.exports = router
