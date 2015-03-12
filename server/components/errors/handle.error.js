/**
 * Created by riclara on 3/11/15.
 */
'use strict';


function handleValidationError(res, message){
  return res.json(400, {
    "code": "ValidationError",
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
    if(err.status_code === 400){
      return handleValidationError(res, err.description);
    }
    return res.json(httpErrorCode, {
      code: err.status_code,
      message: err.description
    });
  }else if(err[0]){
    if(err[0].status_code === 400){
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
      code: httpErrorCode,
      message: JSON.stringify(err)
    });
  }
};

exports.handleError = handleError;
