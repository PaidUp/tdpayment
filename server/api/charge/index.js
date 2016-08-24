'use strict'

const express = require('express')
const controller = require('./charge.controller.js')
const config = require('../../config/environment')
const auth = require('TDCore').authCoreService

const router = express.Router()

router.get('/:connectAccountId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.getChargesList)
router.get('/payment/:paymentId/account/:accountId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.getDepositCharge);

module.exports = router
