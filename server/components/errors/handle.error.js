/**
 * Created by riclara on 3/11/15.
 * https://stripe.com/docs/api#errors
 */
'use strict';


function handleValidationError(res, message){
  return res.json(500, {
    "code": "Error",
    "message": message
  });
}

function handleError(res, err) {
  
  var httpErrorCode = 500;
  if (err.rawType === "invalid_request_error" || err.rawType === "api_error" || err.rawType === "card_error") {
    httpErrorCode = 400;
  }
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
  return res.json(httpErrorCode, {
    code: err.type,
    message:"Oh oh. An error has occurred. If you continue to have this problem, please let us know: ourteam@convenienceselect.com and we will work to resolve the issue quickly."
  });
};

exports.handleError = handleError;
