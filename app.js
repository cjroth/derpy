var fs = require('fs');
var path = require('path');

var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var lodash = require('lodash');
var moment = require('moment');
var pg = require('pg');
var serveStatic = require('serve-static');
var s = require('string');
var sass = require('node-sass');
var UglifyJS = require('uglify-js');
var validator = require('validator');

var partial = require('./lib/middleware/partial');
var title = require('./lib/middleware/title');
var errors = require('./lib/middleware/errors');

var config = require('./config.json');
var javascripts = require('./javascripts.json');

var app = express();

app.set('title', 'Imaginary, LLC');
app.set('view engine', 'jade');
app.set('port',  config.port || process.env.PORT || 3000);

app.locals.basedir = path.join(__dirname, 'views');
app.locals.pretty = app.get('env') === 'development' ? true : false;
app.locals.javascripts = javascripts;
app.locals.copyright = 'Imaginary, LLC';
app.locals.lodash = lodash;
app.locals.moment = moment;
app.locals.s = s;

// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(sass.middleware({
  src: path.join(__dirname, 'public/stylesheets/src'),
  dest: path.join(__dirname, 'public/stylesheets'),
  prefix: '/stylesheets',
  outputStyle: app.get('env') === 'development' ? 'nested' : 'compressed',
}));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(cookieParser(config.secret));
app.use(bodyParser());
app.use(partial('/render'));
app.use(title());

app.get('/', function(req, res, next) {
  res
    .title('Home')
    .render('index');
});

app.get('/error', function(req, res, next) {
  try {
    throw new Error('Test Error');
  } catch(err) {
    next(err);
  }
});

var clientSideJS = UglifyJS.minify(javascripts.map(function(javascript) {
  return path.join(__dirname, 'public', javascript);
}));
fs.writeFileSync(path.join(__dirname, 'public/javascripts/app.min.js'), clientSideJS.code);

app.use(errors.middleware());

var server = app.listen(app.get('port'), function() {
  console.log('server listening on port %d configured for %s', server.address().port, app.get('env'));
});