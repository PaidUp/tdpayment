/**
 * Created by riclara on 3/5/15.
 */
'use strict'

var express = require('express')
var controller = require('./card.controller.js')
var config = require('../../config/environment')
var auth = require('TDCore').authCoreService

var router = express.Router()

router.post('/create', auth.isAuthenticatedServer(config.nodePass.me.token), controller.createCard)
router.post('/associate', auth.isAuthenticatedServer(config.nodePass.me.token), controller.associateCard)
router.post('/debit', auth.isAuthenticatedServer(config.nodePass.me.token), controller.debitCard)
router.post('/debitv2', auth.isAuthenticatedServer(config.nodePass.me.token), controller.debitCardv2)
router.get('/list/customerId/:customerId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.listCards)
router.post('/prepare', auth.isAuthenticatedServer(config.nodePass.me.token), controller.prepareCard)
router.get('/fetch/customerId/:customerId/cardId/:cardId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.fetchCard)
router.get('/default/customerId/:customerId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.getUserDefaultCardId)

module.exports = router
