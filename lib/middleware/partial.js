var fs = require('fs');
var path = require('path');

module.exports = function(pattern, views, engine) {

  return function(req, res, next) {

    if (!req.url.match(pattern)) {
       return next();
    }

    if (!req.query.template) {
      return next(400);
    }

    engine = engine || req.app.get('view engine');
    views = path.resolve(views || req.app.locals.basedir);

    // important for security: only render templates that are in the allowed directory
    var template = path.resolve(path.join(views, req.query.template + '.' + engine));
    if (template.indexOf(views) !== 0) {
      return next(404);
    }

    try {
      if (fs.lstatSync(template).isDirectory()) {
        throw new Error();
      }
    } catch(e) {
      return next(404);
    }

    res.render(req.query.template, req.query);

  };

};