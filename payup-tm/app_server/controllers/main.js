var request = require('request');
var apiParameters = {
  server: 'https://sp-projekt2-excogitator.c9users.io'
};






// COMING SOON PAGE //////////////////////////////////////////////////////

module.exports.index = function(req, res) {
    // DOES NOT NEED PARAMETERS FROM DB.
    res.render('index', {title: 'Home'});
};

/////////////////////////////////////////////////////////////////////////







// COMING SOON PAGE //////////////////////////////////////////////////////

// index is the function exposed by this module. It displays the index page.
module.exports.comingSoon = function(req, res) {
    // DOES NOT NEED PARAMETERS FROM DB.
    res.render('comingSoon', {title: 'Patchnotes'});
};

/////////////////////////////////////////////////////////////////////////









// CONTACTS PAGE ////////////////////////////////////////////////////////

// contacts: contacts page controller.
module.exports.contacts = function(req, res) {
    // Get path to API.
    var path = '/api/contacts';
    // Set request parameters.
    var requestParameters = {
        url: apiParameters.server + path,
        method: 'GET',
        json: {},
    };
    // Perform request.
    request(
        requestParameters,
        // callback function - show website
        function(error, response, content) {
            showContactsPage(req, res, content);
        }
    );
};

// showContactsPage: show contacts page
var showContactsPage = function(req, res, content) {
    res.render('contacts', {title: 'Contacts'});
};

/////////////////////////////////////////////////////////////////////////














// DASHBOARD PAGE ///////////////////////////////////////////////////////

// index is the function exposed by this module. It displays the index page.
module.exports.dashboard = function(req, res) {
    // Get path to API.
    var path = '/api/loans';
    // Set request parameters.
    var requestParameters = {
        url: apiParameters.server + path,
        method: 'GET',
        json: {},
    };
    // Perform request.
    request(
        requestParameters,
        // callback function - show website
        function(error, response, content) {
            showDashboardPage(req, res, content);
        }
    );
};

// 
var showDashboardPage = function(req, res, content) {
    res.render('dashboard', {title: 'Dashboard'});
};
/////////////////////////////////////////////////////////////////////////













// LOANS PAGE ///////////////////////////////////////////////////////

// index is the function exposed by this module. It displays the index page.
module.exports.loans = function(req, res) {
    // Get path to API.
    var path = '/api/loans';
    // Set request parameters.
    var requestParameters = {
        url: apiParameters.server + path,
        method: 'GET',
        json: {},
    };
    // Perform request.
    request(
        requestParameters,
        // callback function - show website
        function(error, response, content) {
            showLoansPage(req, res, content);
        }
    );
};


var showLoansPage = function(req, res, content) {
    res.render('loans', {title: 'Loans'});
};
 
/////////////////////////////////////////////////////////////////////










// PATCHNOTES PAGE //////////////////////////////////////////////////

// index is the function exposed by this module. It displays the index page.
module.exports.patchnotes = function(req, res) {
    res.render('patchnotes', {title: 'Patchnotes'});
};

/////////////////////////////////////////////////////////////////////









// SIGNUP PAGE //////////////////////////////////////////////////////

// index is the function exposed by this module. It displays the index page.
module.exports.signup = function(req, res) {
    // TODO
    res.render('signup', {title: 'Signup'});
};
/////////////////////////////////////////////////////////////////////








// DATABASE INITIALIZATION AND DROPPING /////////////////////////////


// index is the function exposed by this module. It displays the index page.
module.exports.db = function(req, res) {
    // TODO
    res.render('db', {title: 'DB'});
};


module.exports.nukeDB = function(req, res) {
    
    res.render('db', {title: 'DB'});
};

// 
var showDBPage = function(req, res, content) {
    res.render('db', {title: 'DB'});
};

/////////////////////////////////////////////////////////////////////