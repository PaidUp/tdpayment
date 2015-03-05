/**
 * Created by riclara on 3/3/15.
 */
'use strict';

var faker = require('faker');

var data = {
    user:{firstName: faker.name.firstName(),
        lastName:faker.name.lastName(),
        email: faker.internet.email(),
        id: '1'},
    cardDetails : {
        'number' : '4111111111111111',
        'expiration_year': '2016',
        'expiration_month': '12'
    },
    customer : {},
    creditCard : {},
    associateCardData : function(){
        return {
            customerId : this.customer.id,
            cardId : this.creditCard.id
        }
    },
    bankDetails : function(){
        return {
            name: this.user.firstName + ' ' + this.user.lastName,
            account_number: "9900826301",
            routing_number: "021000021"
        }
    },
    bankAccount : {},
    associateBankData : function(){
        return {
            customerId : this.customer.id,
            bankId : this.bankAccount.id
        }
    },
    order : function(){
        return {
        merchantCustomerId : this.customer.id,
        description : 'This is description order test'
    }},
    orderId : '',
    orderBankId : '',
    debitCardData : function(){
        return {
            cardId : this.creditCard.id,
            amount : '150',
            description : 'Order test '+this.user.firstName,
            appearsOnStatementAs: 'Conv. Select',
            orderId : this.orderId
        }
    },
    debitBankData : function(){
        return {
            bankId : this.bankAccount.id,
            amount : '150',
            description : 'Order bank test '+this.user.firstName,
            appearsOnStatementAs: 'Conv. Select',
            orderId : this.orderBankId
        }
    },
    bankAccountVerification : {

    },
    confirmBankVerificationData : function(){
        return {
            verificationId : this.bankAccountVerification.id,
            amount1 : '1',
            amount2  : '1'
        }
    },
    prepareBankData : function(){
        return {
            userId : this.user.id,
            bankId : this.bankAccount.id
        }
    },
    prepareCardData : function(){
        return {
            userId : this.user.id,
            cardId : this.creditCard.id
        }
    }

};

module.exports = data;