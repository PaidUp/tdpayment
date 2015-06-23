'use strict';

var config = require('../../config/environment');
var paymentAdapter = require(config.payment.adapter);

function wone (data, cb) {
    return cb(null, true); 
}

exports.wone = wone;