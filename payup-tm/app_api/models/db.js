var mongoose = require('mongoose');

// link za mLab bazo:
// var dbURI = 'mongodb://payup:payup123@ds123844.mlab.com:23844/payup-tm';

// Dodamo povezavo na lokalno bazo.
var dbURI = 'mongodb://localhost/mongodb';
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MLAB_URI;
} 

/*--------------------------------------------------*/
//               Koda kopirana iz vaj.              //    
/*--------------------------------------------------*/

// If the process exists.
if(process.env.DB_URI){
  dbURI = process.env.DB_URI;
}

// Connect to resource.
mongoose.connect(dbURI, {useNewUrlParser: true, useCreateIndex: true });

// If mongoose connected.
mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + dbURI);
});

// If mongoose encountered error.
mongoose.connection.on('error', function(err) {
  console.log('Mongoose error at connection: ' + err);
});

// If mongoose disconnected.
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose connection has been terminated.');
});

// Function executed when closing.
var runOK = function(message, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose has been closed on ' + message);
    callback();
  });
};

// Re-run with nodemon
process.once('SIGUSR2', function() {
  runOK('nodemon re-run', function() {
    process.exit(0);
    //process.kill(process.pid, 'SIGUSR2');
    //process.exit(); 
  });
});

// Close
process.on('SIGINT', function() {
  runOK('close SIGINT', function() {
    process.exit(0);
  });
});

// Close on Heroku
process.on('SIGTERM', function() {
  runOK('close on Heroku', function() {
    process.exit(0);
  });
});

// Add schemas to DB.
require("./loans");
require("./users");