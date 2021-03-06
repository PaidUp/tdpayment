/**
 * Created by riclara on 3/5/15.
 */

var bankService = require('./bank.service')
var camelize = require('camelize')
var handleError = require('../../components/errors/handle.error').handleError

function createBank (req, res) {
  if (!req.body || !req.body.name) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Name is required'
    })
  }
  if (!req.body || !req.body.account_number) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Account number is required'
    })
  }
  if (!req.body || !req.body.routing_number) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Routing number is required'
    })
  }
  bankService.createBank(req.body, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

function associateBank (req, res) {
  if (!req.body || !req.body.customerId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Customer id is required'
    })
  }
  if (!req.body || !req.body.token) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'token is required'
    })
  }
  bankService.associateBank(req.body.customerId, req.body.token, function (err, data) {
    if (err) {
      return res.status(500).json(err)
    }
    return res.status(200).json(data)
  })
}

function debitBank (req, res) {
  if (!req.body || !req.body.bankId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Bank Id is required'
    })
  }
  if (!req.body || !req.body.amount) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Amount is required'
    })
  }

  if (!req.body || !req.body.description) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Description is required'
    })
  }

  if (!req.body || !req.body.appearsOnStatementAs) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'AppearsOnStatementAs is required'
    })
  }

  if (!req.body || !req.body.orderId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Order Id is required'
    })
  }

  bankService.debitBank(req.body, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

function listCustomerBanks (req, res) {
  if (!req.params || !req.params.customerId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Customer Id is required'
    })
  }
  bankService.listCustomerBanks(req.params.customerId, function (err, data) {
    if (err) {
      return handleError(res, err)
    }else {
      return res.status(200).json(data)
    }
  })
}

function createBankVerification (req, res) {
  if (!req.body || !req.body.bankId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Bank Id is required'
    })
  }
  bankService.createBankVerification(req.body, function (err, data) {
    if (err) {
      return res.status(500).json(err)
    }
    return res.status(200).json(data)
  })
}

function loadBankVerification (req, res) {
  if (!req.params || !req.params.verificationId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Verification Id is required'
    })
  }
  bankService.loadBankVerification(req.params, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

function confirmBankVerification (req, res) {
  if (!req.body || !req.body.bankId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Bank Id is required'
    })
  }
  if (!req.body || !req.body.customerId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Customer Id is required'
    })
  }
  if (!req.body || !req.body.amount1) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Amount 1 is required'
    })
  }
  if (!req.body || !req.body.amount2) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Amount 2 is required'
    })
  }
  bankService.confirmBankVerification(req.body, function (err, data) {
    if (err) {
      return res.status(500).json(err)
    }
    return res.status(200).json(data)
  })
}

function listBanks (req, res) {
  if (!req.params || !req.params.customerId) {
    return res.status(200).json({
      'code': 'ValidationError',
      'message': 'Customer Id is required'
    })
  }

  bankService.listBanks(req.params.customerId, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

function prepareBank (req, res) {
  if (!req.body || !req.body.userId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'User Id is required'
    })
  }
  if (!req.body || !req.body.bankId) {
    return res.status(200).json({
      'code': 'ValidationError',
      'message': 'Bank Id is required'
    })
  }
  bankService.prepareBank(req.body, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

function fetchBank (req, res) {
  if (!req.params || !req.params.bankId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Bank Id is required'
    })
  }

  if (!req.params || !req.params.customerId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'User is required'
    })
  }

  bankService.fetchBank(req.params.customerId, req.params.bankId, function (err, data) {
    if (err) {
      return handleError(res, err)
    }else {
      return res.status(200).json(data)
    }
  })
}

function getUserDefaultBankId (req, res) {
  if (!req.params || !req.params.customerId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'User is required'
    })
  }

  bankService.getUserDefaultBankId(req.params, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

function addBankToAccount (req, res) {
  if (!req.body || !req.body.accountId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Account id is required'
    })
  }
  if (!req.body || !req.body.bankAccount) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Bank account is required'
    })
  }
  if (!req.body.bankAccount || !req.body.bankAccount.country) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Country is required'
    })
  }
  if (!req.body.bankAccount || !req.body.bankAccount.routingNumber) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Routing number is required'
    })
  }
  if (!req.body.bankAccount || !req.body.bankAccount.accountNumber) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Routing number is required'
    })
  }
  bankService.addBankToAccount(req.body.accountId, req.body.bankAccount, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

function deleteBankAccount (req, res) {
  if (!req.params || !req.params.customerId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'User is required'
    })
  }
  if (!req.params || !req.params.bankId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Bank id is required'
    })
  }

  bankService.deleteBankAccount(req.params, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

module.exports = {
  createBank: createBank,
  associateBank: associateBank,
  debitBank: debitBank,
  listCustomerBanks: listCustomerBanks,
  createBankVerification: createBankVerification,
  loadBankVerification: loadBankVerification,
  deleteBankAccount: deleteBankAccount,
  confirmBankVerification: confirmBankVerification,
  listBanks: listBanks,
  prepareBank: prepareBank,
  fetchBank: fetchBank,
  getUserDefaultBankId: getUserDefaultBankId,
  addBankToAccount: addBankToAccount,
  deleteBankAccount: deleteBankAccount
}
