/**
 * Created by riclara on 3/11/15.
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
  var errors = [];

  if (err.name === "ValidationError") {
    httpErrorCode = 400;
  }

  if(err.status_code){
    if(err.status_code !== 200){
      return handleValidationError(res, err.description);
    }
    return res.json(httpErrorCode, {
      code: err.status_code,
      message: err.description
    });
  }else if(err[0]){
    if(err[0].status_code !== 200){
      var des =  err[0].description;
      return handleValidationError(res, des);
    }
    return res.json(httpErrorCode, {
      code: err[0].status_code,
      message: err[0].description
    });
  }
  else{
    return res.json(httpErrorCode, {
      code: 'UnexpectedError',
      message: JSON.stringify(err)
    });
  }
};

exports.handleError = handleError;
