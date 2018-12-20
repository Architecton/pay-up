var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

// Set local strategy
passport.use(new LocalStrategy({
        usernameField: '_id',  // set username field
        passwordField: 'password'   // set password field
    },
    function(username, password, done) {
        User.findById(username).exec(   // Find user by his username
            function(error, user) {
                if (error) {            // If encountered error...
                    return done(error);
                }
                if (!user) {            // If user not found...
                    return done(null, false, {
                        message: 'Wrong username or password'
                    });
                }
                if (!user.validatePassword(password)) {     // If password incorrect...
                    return done(null, false, {
                        message: 'Wrong username or password'
                    });
                }
                return done(null, user);    // If all went well...
            }   
        );
    }
));