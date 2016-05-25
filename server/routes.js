/**
 * Main application routes
 */

'use strict'
var errors = require('./components/errors')

module.exports = function (app) {
  app.use('/api/v1/customer', require('./api/customer'))
  app.use('/api/v1/bank', require('./api/bank'))
  app.use('/api/v1/order', require('./api/order'))
  app.use('/api/v1/card', require('./api/card'))
  app.use('/api/v1/webhook', require('./api/webhook'))
  app.use('/api/v1/transfer', require('./api/transfer'))

  // Insert routes below
  // app.use('/api/things', require('./api/thing'))

  app.get('/swagger.json', function (req, res) {
    return res.sendfile(__dirname + '/swagger.json', 'swagger.json')
  })

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(function (req, res) {
      res.status(404).json({
        'code': 404,
        'message': 'page not found'
      })
    })

  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .post(function (req, res) {
      res.status(404).json({
        'code': 404,
        'message': 'page not found'
      })
    })

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function (req, res) {
      res.status(200).json({'node': 'Payment!!!'})
    })
}
