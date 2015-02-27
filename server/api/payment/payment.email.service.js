'use strict';

var _ = require('lodash');
var path = require('path');
var config = require('../../config/environment');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var loanService = require('../loan/loan.service');
var loanApplicationService = require('../loan/application/loanApplication.service');
var paymentService = require('./payment.service');
var moment = require('moment');
var commerceAdapter = require('../commerce/commerce.adapter');
var userService = require('../user/user.service');

var transporter = nodemailer.createTransport(config.emailService);

exports.sendNewOrderEmail = function (orderId, email, paymentMethod, last4Digits, amount, cb) {
  emailTemplates(config.emailTemplateRoot, function (err, template) {
    if (err) return cb(err);

    var emailVars = config.emailVars;
    emailVars.orderId = orderId;
    emailVars.paymentMethod = paymentMethod;
    emailVars.last4Digits = last4Digits;
    emailVars.amount = amount;

    template('payment/checkout', emailVars, function (err, html, text) {
      if (err) return cb(err);
      var mailOptions = config.emailOptions;
      mailOptions.html = html;
      mailOptions.to = email;
      mailOptions.bcc = config.emailContacts.developer;
      mailOptions.subject = 'New Order from ' + emailVars.companyName;

      mailOptions.attachments = [];
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return cb(err);
        } else {
          return cb(null, info);
        }
      });
      return cb(err, null);
    });
  });
};

exports.sendRemindToAddPaymentMethod = function (applicationId, orderId, cb) {

  var filter = {_id:applicationId};
  loanApplicationService.findOne(filter, function(err, applicationData){
    var userId = applicationData.applicantUserId;
    // get the user data with the userId
    var filter = {_id: userId};

    userService.findOne(filter, function (err, user) {
      if (err) return cb(err);
      if (!user) return cb(false);

      var userFirstName = user.firstName;
      var userEmail = user.email;

      getNameTeamFromOrder(orderId, function(err,team){

        emailTemplates(config.emailTemplateRoot, function (err, template) {

          if (err) return cb(err);

          var emailVars = config.emailVars;
          emailVars.userFirstName = userFirstName;

          template('payment/remindPaymentMethod', emailVars, function (err, html, text) {

            if (err) return cb(err);

            var mailOptions = config.emailOptions;

            mailOptions.html = html;
            mailOptions.to = userEmail;
            mailOptions.bcc = config.emailContacts.developer;
            mailOptions.subject = 'Oops…You Forgot To Add Your Bank Account - ' + team;

            mailOptions.attachments = [];

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                return cb(err);
              } else {
                return cb(null, info);
              }
            });
          });
        });
      });

    });

  });
};

exports.sendRemindToVerifyAccount = function (applicationId, orderId, cb) {
  var userAccountNumber;
  var userFirstName;
  var userEmail;

  var filter = {_id:applicationId};
  loanApplicationService.findOne(filter, function(err, applicationData){
    var userId = applicationData.applicantUserId;

    // get the user data with the userId
    var filter = {_id: userId};

    userService.findOne(filter, function (err, user) {
      if (err) return cb(err);
      if (!user) return cb(false);

      var userEmail;
      var schedule;
      var bankId;
      var acountNumberLast4Digits;
      var userFirstName = user.firstName;
      userEmail = user.email;

      getNameTeamFromOrder(orderId, function(err,team){

        paymentService.getUserDefaultBankId(user, function (err, bankId) {

          paymentService.fetchBank(bankId, function (errTemplate, account) {
            userAccountNumber = account.bankAccounts[0].accountNumber;
            if (errTemplate) return cb(errTemplate);
            emailTemplates(config.emailTemplateRoot, function (err, template) {
              var emailVars = config.emailVars;
              emailVars.userFirstName = userFirstName;
              emailVars.userAccountNumber = userAccountNumber;

              template('payment/remindToVerifyAccount', emailVars, function (err, html, text) {
                if (err) return cb(err);
                var mailOptions = config.emailOptions;
                mailOptions.html = html;
                mailOptions.to = userEmail;
                mailOptions.bcc = config.emailContacts.developer;
                mailOptions.subject = 'Reminder: Verify Your Bank Account – ' + team;
                mailOptions.attachments = [];
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    return cb(err);
                  } else {
                    return cb(null, info);
                  }
                });
              });
            });
          });
        });

      });
    });

  });
};

exports.sendTomorrowChargeLoan = function (requestObject, cb) {

  //  var requestObject = {
  //    loan: '',
  //    schedule: ''
  //  };

  var filter = {_id:requestObject.loan.applicationId};
  loanApplicationService.findOne(filter, function(err, applicationData){

    var userId = applicationData.applicantUserId;

    // get the user data with the userId
    var filter = {_id: userId};

    userService.findOne(filter, function (err, user) {
      if (err) return cb(err);
      if (!user) return cb(false);

      var userEmail;
      var schedule = requestObject.schedule;
      var accountNumber;
      var bankId;
      var userFirstName = user.firstName;

      // find email in contacts to set the send to var
      userEmail = user.email;

      getNameTeamFromOrder(requestObject.orderId, function(err,team){      
        paymentService.getUserDefaultBankId(user, function (err, bankId) {

          if (err === null) {

            paymentService.fetchBank(bankId, function (response, account) {
              accountNumber = account.bankAccounts[0].accountNumber;
              emailTemplates(config.emailTemplateRoot, function (errTemplate, template) {

                if (errTemplate) return cb(errTemplate);

                var emailVars = config.emailVars;
                emailVars.userFirstName = userFirstName;
                emailVars.accountNumber = accountNumber;
                emailVars.amount = parseFloat(schedule.installment).toFixed(2);
                emailVars.datePaymentDue = new moment(schedule.paymentDay).format("dddd, MMMM Do YYYY");

                template('payment/tomorrowChargeLoan', emailVars, function (err, html, text) {
                  if (err) return cb(err);
                  var mailOptions = config.emailOptions;
                  mailOptions.html = html;
                  mailOptions.to = userEmail;
                  mailOptions.bcc = config.emailContacts.developer;
                  mailOptions.subject = 'Reminder: Your Account Will Be Debited in '+ requestObject.days +' Days – ' + team;

                  mailOptions.attachments = [];

                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      return cb(err);
                    } else {
                      return cb(null, info);
                    }
                  });
                });
              });
            });

          }
        });
      });

    });
  });
};

exports.sendFinalEmailCreditCard = function  (user, amount, orderId, cb) {

  var emailVars = config.emailVars;

  emailVars.userFirstName = user.firstName;
  emailVars.amount = parseFloat(amount).toFixed(2);;

  paymentService.getUserDefaultCardId(user, function (err, cardId) {

      paymentService.fetchCard(cardId, function (response, account) {
        emailVars.accountLast4Digits = account.cards[0].number;

        // get the loan object
        commerceAdapter.orderLoad(orderId, function (err, magentoOrder) {

          emailTemplates(config.emailTemplateRoot, function (err, template) {

            if (err) return cb(err);
            emailVars.team = magentoOrder.products[0].productSku.replace(/_/g, ' ');

            template('payment/final', emailVars, function (err, html, text) {

              if (err) return cb(err);

              var mailOptions = config.emailOptions;
              mailOptions.to = user.email;
              mailOptions.bcc = config.emailContacts.admin + "," + config.emailContacts.developer;

              mailOptions.html = html;
              mailOptions.subject = 'Oh Oh – Insufficient Funds In Your Account – ' + emailVars.team;

              mailOptions.attachments = [];

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  return cb(err);
                } else {
                  return cb(null, info);
                }
              });

            });
          });

        });

      });
  });
};

exports.sendProcessedEmail = function  (user, amount, orderId, cb) {

  var emailVars = config.emailVars;

  emailVars.userFirstName = user.firstName;
  emailVars.amount = parseFloat(amount).toFixed(2);;

  paymentService.getUserDefaultBankId(user, function (err, bankId) {

      paymentService.fetchBank(bankId, function (response, account) {
        emailVars.accountLast4Digits = account.bankAccounts[0].accountNumber;

        // get the loan object
        commerceAdapter.orderLoad(orderId, function (err, magentoOrder) {
          var team = magentoOrder.products[0].productSku.replace(/_/g, ' ');
          emailTemplates(config.emailTemplateRoot, function (err, template) {

            if (err) return cb(err);

            template('payment/processed', emailVars, function (err, html, text) {

              if (err) return cb(err);

              var mailOptions = config.emailOptions;
              mailOptions.to = user.email;
              mailOptions.bcc = config.emailContacts.admin + "," + config.emailContacts.developer;

              mailOptions.html = html;
              mailOptions.subject = 'Payment Processed Successfully – ' + team;

              mailOptions.attachments = [];

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  return cb(err);
                } else {
                  return cb(null, info);
                }
              });

            });
          });

        });

      });
  });
};

exports.sendProcessedEmailCreditCard = function  (user, amount, numberCreditCard, orderId, cb) {

  var emailVars = config.emailVars;

  emailVars.userFirstName = user.firstName;
  emailVars.amount = parseFloat(amount).toFixed(2);
  emailVars.accountLast4Digits = numberCreditCard;

  getNameTeamFromOrder(orderId, function(err,team){  
    emailTemplates(config.emailTemplateRoot, function (err, template) {

      if (err) return cb(err);

      template('payment/processed', emailVars, function (err, html, text) {

        if (err) return cb(err);

        var mailOptions = config.emailOptions;
        mailOptions.to = user.email;
        mailOptions.bcc = config.emailContacts.admin + "," + config.emailContacts.developer;

        mailOptions.html = html;
        mailOptions.subject = 'Payment Processed Successfully – ' + team;

        mailOptions.attachments = [];

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return cb(err);
          } else {
            return cb(null, info);
          }
        });

      });
    });
  });
};

exports.sendRetryEmail = function  (userFirstName, email, accountLast4Digits, amount, daysToTry, cb) {

  var emailVars = config.emailVars;

  emailVars.userFirstName = userFirstName;
  emailVars.accountLast4Digits = accountLast4Digits;
  emailVars.amount = parseFloat(amount).toFixed(2);;
  emailVars.daysToTry = daysToTry;

  emailTemplates(config.emailTemplateRoot, function (err, template) {

    if (err) return cb(err);

    template('payment/retry', emailVars, function (err, html, text) {

      if (err) return cb(err);

      var mailOptions = config.emailOptions;
      mailOptions.to = email;
      mailOptions.bcc = config.emailContacts.developer;
      mailOptions.html = html;
      mailOptions.subject = 'Payment notification: Payment failed. We will retry in a few days. ';

      mailOptions.attachments = [];

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return cb(err);
        } else {
          return cb(null, info);
        }
      });

    });



  });
};

exports.sendFinalEmail = function  (user, amount, orderId, cb) {
  var emailVars = config.emailVars;

  emailVars.userFirstName = user.firstName;
  emailVars.amount = parseFloat(amount).toFixed(2);;

  paymentService.getUserDefaultBankId(user, function (err, bankId) {

      paymentService.fetchBank(bankId, function (response, account) {
        emailVars.accountLast4Digits = account.bankAccounts[0].accountNumber;

        // get the loan object
        commerceAdapter.orderLoad(orderId, function (err, magentoOrder) {

          emailTemplates(config.emailTemplateRoot, function (err, template) {

            if (err) return cb(err);
            emailVars.team = magentoOrder.products[0].productSku.replace(/_/g, ' ');

            template('payment/final', emailVars, function (err, html, text) {

              if (err) return cb(err);

              var mailOptions = config.emailOptions;
              mailOptions.to = user.email;
              mailOptions.bcc = config.emailContacts.admin + "," + config.emailContacts.developer;

              mailOptions.html = html;
              mailOptions.subject = 'Oh Oh – Insufficient Funds In Your Account – ' + emailVars.team;

              mailOptions.attachments = [];

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  return cb(error);
                } else {
                  return cb(null, true);
                }

              });

            });

          });

        });

      })
  });
};

function getNameTeamFromOrder(orderId, cb){
  commerceAdapter.orderLoad(orderId, function (err, magentoOrder) {
    if(err || !magentoOrder || !magentoOrder.products){
      cb(null, 'Convenience Select');
    }
    cb(null, magentoOrder.products[0].productSku.replace(/_/g, ' '));
  });
}

