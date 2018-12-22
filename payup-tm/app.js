// All request to the Express server are initialy processed here.

var passport = require('passport');
require('./app_api/models/db');
require('./app_api/configuration/passport');
require('dotenv').load();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var uglifyJs = require('uglify-js');
var fs = require('fs');

var combined = uglifyJs.minify({
  'app.js': fs.readFileSync('app_client/app.js', 'utf-8'),
  'seznam.krmilnik.js': fs.readFileSync('app_client/seznam/seznam.krmilnik.js', 'utf-8'),
  'edugeocachePodatki.storitev.js': fs.readFileSync('app_client/skupno/storitve/edugeocachePodatki.storitev.js', 'utf-8'),
  'geolokacija.storitev.js': fs.readFileSync('app_client/skupno/storitve/geolokacija.storitev.js', 'utf-8'),
  'formatirajRazdaljo.filter.js': fs.readFileSync('app_client/skupno/filtri/formatirajRazdaljo.filter.js', 'utf-8'),
  'prikaziOceno.direktiva.js': fs.readFileSync('app_client/skupno/direktive/prikaziOceno/prikaziOceno.direktiva.js', 'utf-8')
});

fs.writeFile('public/angular/payup.min.js', combined.code, function(error) {
  if (error)
    console.log(error);
  else
    console.log('The script is generated and saved in "payup.min.js".');
});

// routers located in app_server directory
// var indexRouter = require('./app_server/routes/index');
var indexApi = require('./app_api/routes/index');

// Set up Swagger user interface
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./apidoc.json');

// app - the application
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

// Set up path for API documentation
app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// setup logger
app.use(logger('dev'));
// setup json functionality

/*
The json and urlencoded middleware are both part of bodyParser. This is what the README says:

bodyParser([options])
Returns middleware that parses both json and urlencoded. The options are passed to both middleware.

bodyParser.json([options])
Returns middleware that only parses json. The options are:

strict - only parse objects and arrays
limit <1mb> - maximum request body size
reviver - passed to JSON.parse()
bodyParser.urlencoded([options])
Returns middleware that only parses urlencoded with the qs module. The options are:

limit <1mb> - maximum request body size
*/

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setup cookie parser
app.use(cookieParser());

// To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

// Use passport
app.use(passport.initialize());

// Add router -- Forward requests to indexRouter
// app.use('/', indexRouter);

// forward all request beginning with /api to indexAPI router
app.use('/api', indexApi);

// Send index.html (starting page)
app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});


// catch 404 and forward to error handler.
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler for errors with 404 and 500 statuses
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Error handler for authentication errors
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({
      "message": err.name + ": " + err.message
    });
  }
});

// Expose app as module.
module.exports = app;