'use strict';

var express = require('express');
var router = express.Router();

router.use('/bank', require('./bank/index'));
router.use('/card', require('./card/index'));

module.exports = router;
