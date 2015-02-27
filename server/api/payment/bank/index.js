'use strict';

var express = require('express');
var authService = require('../../auth/auth.service');
var controller = require('./bank.controller');

var router = express.Router();

router.post('/create',authService.isAuthenticated(), controller.create);
router.get('/list',authService.isAuthenticated(), controller.listBanks);
router.get('/pending',authService.isAuthenticated(), controller.pending);
router.get('/delete/:customerId/:bankId',authService.isAuthenticated(), controller.deleteBankAccount);
router.post('/verify',authService.isAuthenticated(), controller.verify);

router.get('/:id',authService.isAuthenticated(), controller.getBank);
module.exports = router;
