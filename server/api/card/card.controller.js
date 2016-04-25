'use strict'

var cardService = require('./card.service.js')
var handleError = require('../../components/errors/handle.error').handleError

function createCard (req, res) {
  if (!req.body || !req.body.number) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Card number id is required'
    })
  }
  if (!req.body || !req.body.exp_year) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Expiration year is required'
    })
  }
  if (!req.body || !req.body.exp_month) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Expiration month is required'
    })
  }
  cardService.createCard({card: req.body}, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

function associateCard (req, res) {
  if (!req.body || !req.body.customerId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Customer id is required'
    })
  }
  if (!req.body || !req.body.cardId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Card id is required'
    })
  }
  cardService.associateCard(req.body.customerId, req.body.cardId, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

function debitCard (req, res) {
  if (!req.body || !req.body.cardId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Card Id is required'
    })
  }
  if (!req.body || !req.body.amount) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'amount is required'
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
      'message': 'appearsOnStatementAs is required'
    })
  }

  if (!req.body || !req.body.customerId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Customer Id is required'
    })
  }

  if (!req.body || !req.body.providerId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Destination Id is required'
    })
  }

  cardService.debitCard(req.body, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

function debitCardv2 (req, res) {
  if (!req.body || !req.body.cardId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Card Id is required'
    })
  }
  if (!req.body || !req.body.amount) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'amount is required'
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
      'message': 'appearsOnStatementAs is required'
    })
  }

  if (!req.body || !req.body.customerId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Customer Id is required'
    })
  }

  if (!req.body || !req.body.providerId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Destination Id is required'
    })
  }

  cardService.debitCardv2(req.body, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

function listCards (req, res) {
  if (!req.params || !req.params.customerId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Customer Id is required'
    })
  }
  cardService.listCards(req.params, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

function prepareCard (req, res) {
  if (!req.body || !req.body.userId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'User Id is required'
    })
  }
  if (!req.body || !req.body.cardId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Card Id is required'
    })
  }
  cardService.prepareCard(req.body, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

function fetchCard (req, res) {
  if (!req.params || !req.params.cardId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Card Id is required'
    })
  }

  if (!req.params || !req.params.customerId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Customer Id is required'
    })
  }

  cardService.fetchCard(req.params.customerId, req.params.cardId, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

function getUserDefaultCardId (req, res) {
  if (!req.params || !req.params.customerId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'User is required'
    })
  }

  cardService.getUserDefaultCardId(req.params, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

module.exports = {
  createCard: createCard,
  associateCard: associateCard,
  debitCard: debitCard,
  debitCardv2: debitCardv2,
  listCards: listCards,
  prepareCard: prepareCard,
  fetchCard: fetchCard,
  getUserDefaultCardId: getUserDefaultCardId
}
