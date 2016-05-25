'use strict'

const express = require('express')
const controller = require('./transfer.controller.js')
const config = require('../../config/environment')
const auth = require('TDCore').authCoreService

const router = express.Router()

router.get('/:destinationId', auth.isAuthenticatedServer(config.nodePass.me.token), controller.getTransfers)
module.exports = router
