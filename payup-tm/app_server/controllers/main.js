var loanDataJSON = require('../models/loans.json');
var contactsDataJSON = require('../models/contacts.json');

// index is the function exposed by this module. It displays the index page.
module.exports.index = function(req, res) {
    /* Klic prevajanja PUG v html datoteko.
    Metoda render prejme kot prvi parameter ime predloge, 
    ki jo želimo uporabiti in v našem primeru referencira datoteko index.pug,
    drugi parameter pa je JavaScript objekt, kjer lahko opredelimo parametre
    pri generiranju HTML datoteke. */
    res.render('index', {title: 'Home'});
};

// index is the function exposed by this module. It displays the index page.
module.exports.comingSoon = function(req, res) {
    // TODO
    res.render('comingSoon', {title: 'Patchnotes'});
};


// index is the function exposed by this module. It displays the index page.
module.exports.contacts = function(req, res) {
    // TODO
    res.render('contacts', contactsDataJSON);
};


// index is the function exposed by this module. It displays the index page.
module.exports.dashboard = function(req, res) {
    // TODO
    res.render('dashboard', loanDataJSON);
};


// index is the function exposed by this module. It displays the index page.
module.exports.loans = function(req, res) {
    // TODO
    res.render('loans', loanDataJSON);
};


// index is the function exposed by this module. It displays the index page.
module.exports.patchnotes = function(req, res) {
    res.render('patchnotes', {title: 'Patchnotes'});
};


// index is the function exposed by this module. It displays the index page.
module.exports.signup = function(req, res) {
    // TODO
    res.render('signup', {title: 'Signup'});
};

// index is the function exposed by this module. It displays the index page.
module.exports.db = function(req, res) {
    // TODO
    res.render('db', {title: 'DB'});
};