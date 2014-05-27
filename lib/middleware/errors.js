var util = require('util');

function AuthorizationError(message) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.status = 401;
  this.message = message;
  this.name = this.constructor.name;
}
util.inherits(AuthorizationError, Error);


function ValidationError(message) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.status = 400;
  this.message = message;
  this.name = this.constructor.name;
}
util.inherits(ValidationError, Error);


function middleware() {
  return function(err, req, res, next) {

    if (!util.isError(err)) {
      err = new Error(err);
    }

    err.status = err.status || 500;

    res.locals.error = err;

    res
      .status(err.status)
      .render('error');

    if (err.status >= 500) {
      console.error(err.stack);
    }

  };
}

module.exports.middleware = middleware;
module.exports.AuthorizationError = AuthorizationError;
module.exports.ValidationError = ValidationError;