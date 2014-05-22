var path = require('path');

var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var jade = require('jade');
var lodash = require('lodash');
var moment = require('moment');
var pg = require('pg');
var serveStatic = require('serve-static');
var s = require('string');
var validator = require('validator');

var title = require('./lib/middleware/title');
var errors = require('./lib/middleware/errors');

var config = require('./config.json');

var app = express();

app.set('title', 'Imaginary, LLC');
app.set('view engine', 'jade');

app.locals.basedir = path.join(__dirname, 'views');
app.locals.pretty = app.get('env') === 'development' ? true : false;
app.locals.copyright = 'Imaginary, LLC';
app.locals.lodash = lodash;
app.locals.moment = moment;
app.locals.s = s;

// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(cookieParser(config.secret));
app.use(bodyParser());
app.use(title());

app.get('/', function(req, res, next) {
  res
    .title('Home')
    .render('index');
});

app.get('/render', function(req, res, next) {
  var template = path.join('jade', req.query.template + '.jade');
  res.render(template, req.query);
});

app.use(errors());

app.listen(9999);