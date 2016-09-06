'use strict'

const express = require('express')
const controller = require('./charge.controller.js')
const config = require('../../config/environment')
const auth = require('TDCore').authCoreService

const router = express.Router()

router.get('/:connectAccountId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.getChargesList)
router.get('/payment/:paymentId/account/:accountId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.getDepositCharge);
router.get('/payment/:paymentId/account/:accountId/refund', auth.isAuthenticatedServer(config.nodePass.me.token), controller.getDepositChargeRefund);
router.post('/refund', auth.isAuthenticatedServer(config.nodePass.me.token), controller.refund);

module.exports = router
