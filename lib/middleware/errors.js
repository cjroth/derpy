module.exports = function() {
  return function(err, req, res, next) {
    console.trace(err);
    if (typeof err === 'string') {
      err = { form: [err] };
    }
    if (err instanceof Error) {
      err = { form: [err.message] };
    }
    res.json(500, err);
  };
};