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





// CONTACTS PAGE //////////////////////////////////////////////////////// ***

// contacts: contacts page controller.
module.exports.contacts = function(req, res) {
    // Get path to API.
    var idUser = req.params.idUser;
    var path = '/api/' + idUser + '/contacts';
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

// contacts: contacts page controller.
module.exports.contactById = function(req, res) {
    // Get user id and contact id from path parameters.
    var idUser = req.params.idUser;
    var idContact = req.params.idContact;
    // Get path for API
    var path = '/api/users/' + idUser + '/contacts/' + idContact;
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



// DASHBOARD PAGE /////////////////////////////////////////////////////// ***

// index is the function exposed by this module. It displays the index page.
module.exports.dashboard = function(req, res) {
    // Get path to API.
    var idUser = req.params.idUser;
    var path = '/api/' + idUser + '/loans';
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

// showDashboardPage: show dashboard page.
var showDashboardPage = function(req, res, content) {
    res.render('dashboard', {title: 'Dashboard'});
};
/////////////////////////////////////////////////////////////////////////









// LOANS PAGE /////////////////////////////////////////////////////// ***

// loans: 
module.exports.loans = function(req, res) {
    
    var idUser = req.params.idUser;
    var path = '/api/' + idUser + '/loans';
    
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

// TODO - INSERT JSON
module.exports.loansManageCreate = function(req, res) {
    var idUser = req.params.idUser;
    var idLoan = req.params.idLoan;
    var path = '/api/' + idUser + '/loans/' + idLoan;
    
    // Set request parameters.
    var requestParameters = {
        url: apiParameters.server + path,
        method: 'POST',
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

// loansManageDelete: delete loan with specified ID
module.exports.loansManageDelete = function(req, res) {
    
    var idUser = req.params.idUser;
    var idLoan = req.params.idLoan;
    var path = '/api/' + idUser + '/loans/' + idLoan;
    
    // Set request parameters.
    var requestParameters = {
        url: apiParameters.server + path,
        method: 'DELETE',
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


// TODO - INSERTING JSON
// loansManageUpdate: update loan with specified ID.
module.exports.loansManageUpdate = function(req, res) {
    
    var idUser = req.params.idUser;
    var idLoan = req.params.idLoan;
    var path = '/api/' + idUser + '/loans/' + idLoan;
    
    // Set request parameters.
    var requestParameters = {
        url: apiParameters.server + path,
        method: 'PUT',
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

// showLoansPage: show loans page
var showLoansPage = function(req, res, content) {
    res.render('loans', {title: 'Loans'});
};

/////////////////////////////////////////////////////////////////////




// PATCHNOTES PAGE ////////////////////////////////////////////////// ***

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

// TODO INSERT JSON
// signupSubmit: submit signup info.
module.exports.signupSubmit = function(req, res) {
    // Get path to API.
    var path = '/api/users';
    // Set request parameters.
    var requestParameters = {
        url: apiParameters.server + path,
        method: 'POST',
        json: {},
    };
    // Perform request.
    request(
        requestParameters,
        // callback function - show website
        function(error, response, content) {
            showSignupPage(req, res, content);
        }
    );
};

// showSignupPage: display signup page.
var showSignupPage = function(req, res, content) {
    res.render('signup', {title: 'Signup'});
};

/////////////////////////////////////////////////////////////////////





// DATABASE INITIALIZATION AND DROPPING ///////////////////////////// ***

// db page. If user clicks on nukeDB button, redirect to /db/nukeDB
module.exports.db = function(req, res) {
    res.render('db', {title: 'DB'});
};

// nukeDB: Remove all entries from database.
module.exports.nukeDB = function(req, res) {
    // Get path to API.
    var path = '/api/nukeDB';
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
            showDBPage(req, res, content);
        }
    );
};

// nukeDB: Remove all entries from database.
module.exports.fillDB = function(req, res) {
    // Get path to API.
    var path = '/api/fillDB';
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
            showDBPage(req, res, content);
        }
    );
};

var showDBPage = function(req, res, content) {
    res.render('db', {title: 'DB'});
};

/////////////////////////////////////////////////////////////////////