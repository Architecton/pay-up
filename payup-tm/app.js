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

var uglifyjs = require('uglify-js');
var fs = require('fs');


// TODO: NOTE: datoteke oblike x.min.js daj ven!
/*
var combined = uglifyjs.minify({
  'dashboard.controller.js': fs.readFileSync('app_client/dashboard/dashboard.controller.js', 'utf-8'),
  'loansData.service.js': fs.readFileSync('app_client/common/services/loansData.service.js', 'utf-8'),
  'loansList.service.js': fs.readFileSync('app_client/common/services/loansList.service.js', 'utf-8'),
  'navbar.directive.js': fs.readFileSync('app_client/common/directives/navbar/navbar.directive.js', 'utf-8'),
  'angular.min.js' : fs.readFileSync('public/angular/angular.min.js', 'utf-8'),
  'angular-route.min.js' : fs.readFileSync('app_client//lib/angular-route.min.js', 'utf-8'),
  'angular-sanitize.min.js' : fs.readFileSync('app_client/lib/angular-sanitize.min.js', 'utf-8'),
  'app.js' : fs.readFileSync('app_client/app.js', 'utf-8'),
  'navbar.controller.js' : fs.readFileSync('app_client/common/directives/navbar/navbar.controller.js', 'utf-8'),
  'contacts.controller.js' : fs.readFileSync('app_client/contacts/contacts.controller.js', 'utf-8'),
  'signup.controller.js' : fs.readFileSync('app_client/authentication/signup/signup.controller.js', 'utf-8'),
  'db.controller.js' : fs.readFileSync('app_client/db/db.controller.js', 'utf-8'),
  'loans.controller.js' : fs.readFileSync('app_client/loans/loans.controller.js', 'utf-8'),
  'modal.controller.js' : fs.readFileSync('app_client/common/directives/modal/modal.controller.js', 'utf-8'),
  'contactManagement.service.js' : fs.readFileSync('app_client/common/services/contactManagement.service.js', 'utf-8'),
  'loanManagement.service.js' : fs.readFileSync('app_client/common/services/loanManagement.service.js', 'utf-8'),
  'contactsData.service.js' : fs.readFileSync('app_client/common/services/contactsData.service.js', 'utf-8'),
  'contactsList.service.js' : fs.readFileSync('app_client/common/services/contactsList.service.js', 'utf-8'),
  'authentication.service.js' : fs.readFileSync('app_client/common/services/authentication.service.js', 'utf-8'),
  'testHelper.service.js' : fs.readFileSync('app_client/common/services/testHelper.service.js', 'utf-8'),
  'modal.directive.js' : fs.readFileSync('app_client/common/directives/modal/modal.directive.js', 'utf-8'),
  'sweetalert2.all.min.js' : fs.readFileSync('app_client/style/sweetalert2/dist/sweetalert2.all.min.js', 'utf-8'),
  'chart.js' : fs.readFileSync('app_client/style/js/chart.js', 'utf-8'),
  'bootstrap-formhelpers.min.js' : fs.readFileSync('app_client/style/form-helpers/dist/js/bootstrap-formhelpers.min.js', 'utf-8')
});

fs.writeFile('public/angular/payup.min.js', combined.code, function(error) {
  if (error) {
    console.log(error);
  } else {
    console.log('The script is generated and saved in "payup.min.js".');
  }
});

*/

// routers located in app_server directory
// var indexRouter = require('./app_server/routes/index');
var indexApi = require('./app_api/routes/index');

// Set up Swagger user interface
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./apidoc.json');

// app - the application
var app = express();

// Middleware to handle certain security flaws.
app.use(function(req, res, next) {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  next();
});



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