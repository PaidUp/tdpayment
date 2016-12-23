'use strict'

const express = require('express')
const controller = require('./transfer.controller.js')
const config = require('../../config/environment')
const auth = require('TDCore').authCoreService

const router = express.Router()

router.get('/:destinationId/from/:from/to/:to', auth.isAuthenticatedServer(config.nodePass.me.token), controller.getTransfers)
router.get('/retrieve/:transferId',  auth.isAuthenticatedServer(config.nodePass.me.token), controller.retrieveTransfer)
module.exports = router
