/**
 * Created by riclara on 3/11/15.
 * https://stripe.com/docs/api#errors
 */
'use strict';


function handleValidationError(res, message){
  return res.status(500).json({
    "code": "Error",
    "message": message
  });
}

function handleError(res, err) {

  var httpErrorCode = 500;
  if (err.rawType === "invalid_request_error" || err.rawType === "api_error" || err.rawType === "card_error") {
    httpErrorCode = 400;
  }
  var result = {}
  switch (err.type) {
    case 'StripeCardError':
      // A declined card error
      err.message; // => e.g. "Your card's expiration year is invalid."
      break;
    case 'StripeInvalidRequest':
      // Invalid parameters were supplied to Stripe's API
      break;
    case 'StripeAPIError':
      // An error occurred internally with Stripe's API
      break;
    case 'StripeConnectionError':
      // Some kind of error occurred during the HTTPS communication
      break;
    case 'StripeAuthenticationError':
      // You probably used an incorrect API key
      break;
  }
  result.detail =  err.message;
  result.code =  err.type;
  result.message = "Oh oh. An error has occurred. If you continue to have this problem, please let us know: support@getpaidup.com and we will work to resolve the issue quickly.";
  return res.status(httpErrorCode).json(result);
};

exports.handleError = handleError;
