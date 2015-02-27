'use strict';

var express = require('express');
var router = express.Router();
var authService = require('../../auth/auth.service');
var controller = require('./card.controller');

router.post('/associate',authService.isAuthenticated(), controller.associate);
router.get('/list',authService.isAuthenticated(), controller.listCards);

router.get('/:id',authService.isAuthenticated(), controller.getCard);
module.exports = router;
