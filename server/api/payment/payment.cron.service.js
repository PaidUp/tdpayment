'use strict';

var _ = require('lodash');
var path = require('path');
var config = require('../../config/environment');
var paymentService = require('./payment.service');
var commerceAdapter = require('../commerce/commerce.adapter');
var loanService = require('../loan/loan.service');
var userService = require('../user/user.service');
var async = require('async');
var moment = require('moment');
var logger = require('../../config/logger');
var paymentEmailService = require('./payment.email.service');
var loanApplicationService = require('../loan/application/loanApplication.service');

exports.collectOneTimePayments = function (cb) {
  var results = [];

  // 1) Load "pending" magento orders with all "comments"
  paymentService.collectPendingOrders(function (err, data) {
    //logger.log('info', 'Magento pending orders: '+ data.length + ' found.');
    async.eachSeries(data, function (order, callback) {
      if (order.paymentMethod === 'creditcard' && order.payment === 'onetime') {
        userService.findOne({_id : order.userId}, function (err, user){
          paymentService.capture(order, user, order.products[0].BPCustomerId, order.grandTotal, order.paymentMethod, function(err, data){
            if (err) callback(err);
            callback();
          });
        });
      }
      else {
        callback();
      }
    }, function (err) {
      if (err) {
        logger.log('error', err);
        return cb(err);
      }
      return cb(null, true);
    });
  });
}

exports.collectLoanPayments = function (period, cb) {
  var isFinished = false;
  var currentDate = moment();
  // List active loans
  loanService.find({state: 'active'}, function(err, loans) {

    // Collect pending schedule
    async.eachSeries(loans, function (loan, mainCallback) {
      var payments = [];

      async.each(loan.schedule, function(paymentScheduled, callback) {
        var paymentDate = moment(paymentScheduled.paymentDay);
        if (currentDate.year() === paymentDate.year() &&
          currentDate.month() === paymentDate.month() &&
          currentDate.date() === paymentDate.date() &&
          paymentScheduled.state === 'pending') {
          switch (period) {
            case 'hours':
              if (currentDate.hour() === paymentDate.hour()) {
                payments.push(loan.schedule.indexOf(paymentScheduled));
                callback();
              }
              break;
            case 'minutes':
              if (currentDate.hour() === paymentDate.hour() &&
                currentDate.minute() === paymentDate.minute()) {
                payments.push(loan.schedule.indexOf(paymentScheduled));
                callback();
              }
              break;
            default:
              payments.push(loan.schedule.indexOf(paymentScheduled));
              callback();
          }
        }
        else {
          callback();
        }
      }, function(err){

      });

      // Capture
      async.eachSeries(payments, function(paymentId, callback) {
        loanService.captureLoanSchedule(loan, paymentId, function (err, data) {


          if(err) callback(err);
            callback();
          });
        }, function (err) {
            if (err) {
              logger.log('error', err);
              mainCallback(err);
        }
          mainCallback();
      });

    }, function (err) {
      if (err) {
        logger.log('error', err);
        return cb(err);
      }
      if(!isFinished){
        isFinished = true;
        return cb(null, true);
      }

    });
  });
};

exports.sendRemindToAddPaymentMethod = function(cb){
  var period = config.notifications.reminderNoPaymentAdded.period;
  var value = config.notifications.reminderNoPaymentAdded.value;
  var currentDate = moment();
  // List active loans
  loanService.find({state: 'active'}, function(err, loans) {
    // Collect pending schedule
    async.eachSeries(loans, function (loan, mainCallback) {

      ValidateBankAccount(loan.applicationId, function(err, bankId){
        if(!err){
          mainCallback();
        }
        else if(err.name === 'not-available-payment'){
          if(!loan.notifications){
            loan.notifications = [];
          }
          var noticationsLength = loan.notifications.length;
          var isnotified = false;
          var oneHourAfter = new moment(loan.createAt).add(value, period);
          if (currentDate.isAfter(oneHourAfter)) {
            for(var i=0; i<noticationsLength && !isnotified;i++)
            {
              if(loan.notifications[i].type === 'reminderNoPaymentAdded'){
                isnotified = true;
              }
            }
            if(!isnotified){
              var objNotification = {
                type:'reminderNoPaymentAdded',
                sentDate: new moment().format()
              };
              loan.notifications.push(objNotification);
              loanService.save(loan, function(err, newLoan){

                  paymentEmailService.sendRemindToAddPaymentMethod(loan.applicationId,loan.orderId,function(err, data){
                    logger.log('info', 'send email remind to add payment method. ');
                    //Sent email.
                    mainCallback();
                  });
              });
            }else{
              mainCallback();
            }
          }
          else {
            mainCallback();
          }
        }else{
          mainCallback();
        }
      });

    }, function (err) {
      if (err) {
        logger.log('error', err);
        return cb(err);
      }
        return cb(null, true);
    });
  });
}

exports.sendRemindToVerifyAccount = function(cb){
  var period = config.notifications.reminderNoBankAccountVerified.period;
  var value = config.notifications.reminderNoBankAccountVerified.value;
  var currentDate = new moment();
  // List active loans
  loanService.find({state: 'active'}, function(err, loans) {
    // Collect pending schedule
    async.eachSeries(loans, function (loan, mainCallback) {

      ValidateBankAccount(loan.applicationId, function(err, bankId){
        if(!err){
          mainCallback();
        }
        else if(err.name === 'not-bank-verified'){
          if(!loan.notifications){
            loan.notifications = [];
          }
          var noticationsLength = loan.notifications.length;
          var isnotified = false;
          var twoDayBefore = new moment(loan.schedule[0].paymentDay).subtract(value, period);
          if (currentDate.isAfter(twoDayBefore) && currentDate.isBefore(loan.schedule[0].paymentDay) && loan.schedule[0].state === 'pending'){
            for(var j=0; j<noticationsLength && !isnotified;j++)
            {
              if(loan.notifications[j].type === 'reminderNoBankAccountVerified'){
                isnotified = true;
              }
            }
            if(!isnotified){
              var objNotification = {
                type:'reminderNoBankAccountVerified',
                sentDate: new moment().format()
              };
              loan.notifications.push(objNotification);
              loanService.save(loan, function(err, newLoan){
                  paymentEmailService.sendRemindToVerifyAccount(loan.applicationId, loan.orderId,function(err, data){
                    logger.log('info', 'send email remind to verify account. ' + data );
                    //Sent email.
                    mainCallback();
                  });

              });
            }else{
              mainCallback();
            }
          }
          else {
            mainCallback();
          }
        }else{
          mainCallback();
        }
      });

    }, function (err) {
      if (err) {
        logger.log('error', err);
        return cb(err);
      }
        return cb(null, true);
    });
  });
}

exports.sendTomorrowChargeLoan = function(cb){
  var period = config.notifications.reminderChargeAccount.period;
  var value = config.notifications.reminderChargeAccount.value;
  var isFinished = false;
  var currentDate = moment();
  // List active loans
  loanService.find({state: 'active'}, function(err, loans) {
    // Collect pending schedule
    async.eachSeries(loans, function (loan, mainCallback) {

      ValidateBankAccount(loan.applicationId, function(err, bankId){
        if(!err){
          if(!loan.notifications){
            loan.notifications = [];
          }
          var noticationsLength = loan.notifications.length;
          
          var index = 0;
          async.eachSeries(loan.schedule, function(schedule, callbackSchedule){
            var isnotified = false;
            if (schedule.state === 'pending'){
              var i=0;
              for(i=0;i<noticationsLength && !isnotified;i++){
                if(loan.notifications[i].type === 'reminderChargeAccount' && loan.notifications[i].paymentIndex === index){
                  isnotified = true;
                  callbackSchedule();
                }
              }
              if(!isnotified){
                var oneDayBefore = new moment(schedule.paymentDay).subtract(value, period);
                if(currentDate.isAfter(oneDayBefore) && currentDate.isBefore(schedule.paymentDay)){
                  var objNotification = {
                    type:'reminderChargeAccount',
                    paymentIndex : index,
                    sentDate: new moment().format()
                  };
                  loan.notifications.push(objNotification);
                  loanService.save(loan, function(err, newLoan){
                    paymentEmailService.sendTomorrowChargeLoan({loan:loan,schedule:schedule, days:value,orderId:loan.orderId},function(err, data){
                      logger.log('info', 'send email reminder tomorrow charge loan ' );
                      mainCallback();
                    });
                  });
                }else{
                  index = index + 1;
                  callbackSchedule();
                }
              }else{
                index = index + 1;
                callbackSchedule();
              }
            }else{
              index = index + 1;
              callbackSchedule();
            }

          }, function(err){
              if (err) {
                logger.log('error', err);
              }
              return mainCallback();
          });
        }else{
          mainCallback();
        }
      });
    }, function(err) {
      if (err) {
        logger.log('error', err);
        return cb(null,err);
      }
      if(!isFinished){
        isFinished = true;
        return cb(null, true);
      }
    });
  });
}

function ValidateBankAccount(applicationId, cb){
  var filterLoanApp = {_id:applicationId};
  loanApplicationService.findOne(filterLoanApp, function(err, applicationData){
    var filterUser = {_id: applicationData.applicantUserId};
    userService.findOne(filterUser, function (err, user) {
      paymentService.getUserDefaultBankId(user, function (err, bankId) {
        if(err){
          return cb(err);
        }
        return cb(null, bankId)
      });
    });
  });
}

