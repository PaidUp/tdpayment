'use strict'

const express = require('express')
const controller = require('./balance.controller.js')
const config = require('../../config/environment')
const auth = require('TDCore').authCoreService

const router = express.Router()

router.get('/:connectAccountId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.getBalance)
module.exports = router
