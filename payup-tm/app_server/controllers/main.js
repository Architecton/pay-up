var request = require('request');
var apiParameters = {
  server: 'https://sp-projekt2-excogitator.c9users.io'
};




// RENDER HOME PAGE ////////////////////////////////////////////////////////////
module.exports.index = function(req, res) {
    res.render('index', {});
};

////////////////////////////////////////////////////////////////////////////////





// RENDER COMING SOON PAGE //////////////////////////////////////////////////////

// index is the function exposed by this module. It displays the index page.
module.exports.comingSoon = function(req, res) {
    res.render('comingSoon', {});
};

/////////////////////////////////////////////////////////////////////////////////






// RENDER CONTACTS PAGE ////////////////////////////////////////////////////////

// contacts: contacts page controller.
module.exports.contacts = function(req, res) {
    var idUser = req.params.idUser;                     // Get path to API.
    var path = '/api/users/' + idUser + '/contacts';
    var requestParameters = {                           // Set request parameters.
        url: apiParameters.server + path,
        method: 'GET',
        json: {},
    };
    request(                                            // Perform request.
        requestParameters,
        function(error, response, content) {            // callback function - render website using obtained data.
            // TODO
            content = {"contacts" : content};
            showContactsPage(req, res, content);
        }
    );
};

////////////////////////////////////////////////////////////////////////////////

// CREATE NEW CONTACT /////////////////////////////////////////////////////////
module.exports.contactCreate = function(req, res) {
    // Get path to API.
    var idUser = req.params.idUser;                     // Get idUser from path.
    var path = '/api/users/' + idUser + '/contacts';    // Construct API call path.
    
    var dataInBody = {                                  // Get request body
      name: req.body.name,
      surname: req.body.surname,
      username: req.body.username,
      email: req.body.email
    };
    
    var requestParameters = {                           // Set request parameters.
        url: apiParameters.server + path,
        method: 'POST',
        json: dataInBody,
    };
    
    request(                                            // Perform request.
        requestParameters,
        // callback function - render website.
        function(error, response, content) {
            // TODO
            res.render('index', {});
            // showGenericDone(req, res, content);
        }
    );
};

//////////////////////////////////////////////////////////////////////////////


// ADD CONTACT NOTES /////////////////////////////////////////////////////////

// contacts: contacts page controller - edit contact notes.
module.exports.contactAddNotes = function(req, res) {
    
    // Get path to API.
    var idUser = req.params.idUser;
    var idContact = req.params.idContact;
    var path = '/api/users/' + idUser + '/contacts/' + idContact;
    // Set request parameters.
    
    var dataInBody = {                          // Get request body.
      notes: req.body.notes
    };
                                                // Get request parameters.
    var requestParameters = {
        url: apiParameters.server + path,
        method: 'PUT',
        json: dataInBody,
    };                                          // Perform request.
    request(
        requestParameters,
        // callback function - render website
        function(error, response, content) {
            // TODO
            res.render('index', {});
        }
    );
};

//////////////////////////////////////////////////////////////////////////////


// DELETE CONTACT ////////////////////////////////////////////////////////////

// contacts: contacts page controller - delete contact
module.exports.contactDelete = function(req, res) {
    
    // Get path to API.
    var idUser = req.params.idUser;
    var idContact = req.params.idContact;
    var path = '/api/users/' + idUser + '/contacts/' + idContact;
    
    var requestParameters = {                   // Set request parameters.
        url: apiParameters.server + path,
        method: 'DELETE',
        json: {},
    };                                          // Perform request.
    request(
        requestParameters,
        // callback function - render website
        function(error, response, content) {
            // TODO
            res.render('index', {});
        }
    );
};

//////////////////////////////////////////////////////////////////////////////

// showContactsPage: show contacts page with obtained content.
var showContactsPage = function(req, res, content) {
    console.log(content);
    res.render('contacts', content);
};

/////////////////////////////////////////////////////////////////////////




// RENDER DASHBOARD PAGE ////////////////////////////////////////////////

// index is the function exposed by this module. It displays the index page.
module.exports.dashboard = function(req, res) {
    var idUser = req.params.idUser;                     // Get idUser from path.
    var path = '/api/users/' + idUser + '/loans';
    var requestParameters = {                           // Set request parameters.
        url: apiParameters.server + path,
        method: 'GET',
        json: {},
    };
    
    request(                                            // Perform request.
        requestParameters,                              // callback function - show website
        function(error, response, content) {
            content = {loans: content};
            showDashboardPage(req, res, content);
        }
    );
};

// showDashboardPage: show dashboard page.
var showDashboardPage = function(req, res, content) {
    res.render('dashboard', content);
};


/////////////////////////////////////////////////////////////////////////



// RENDER LOANS PAGE ////////////////////////////////////////////////////

// loans: 
module.exports.loans = function(req, res) {
    
    // Get needed parameters from path.
    var idUser = req.params.idUser;
    var path = '/api/users/' + idUser + '/loans';
    
    var requestParameters = {                                       // Set request parameters.
        url: apiParameters.server + path,
        method: 'GET',
        json: {},
    };

    request(                                                        // Perform request.
        requestParameters,
        // callback function - show website
        function(error, response, content) {
            content = {loans: content};
            showLoansPage(req, res, content);
        }
    );
};

//////////////////////////////////////////////////////////////////////////



// CREATE NEW LOAN ///////////////////////////////////////////////////////

module.exports.loansManageCreate = function(req, res) {
    
    var idUser = req.params.idUser;                     // Get necessary parameters from path.
    var path = '/api/users/' + idUser + '/loans';       // Get path for API call.
    
    var dataInBody = {                                  // Get request body parameters.
      loaner: req.body.loaner,
      recipient: req.body.recipient,
      deadline: req.body.deadline,
      amount: req.body.amount,
      currency: req.body.currency,
      interest: req.body.interest,
      payment_interval: req.body.payment_interval,
      payment_amount: req.body.payment_amount,
      compoundInterest: req.body.compoundInterest,
      interest_on_debt: req.body.interest_on_debt,
    };
    
    var requestParameters = {                           // Set request parameters.
        url: apiParameters.server + path,
        method: 'POST',
        json: dataInBody,
    };
    
    request(                                            // Perform request.
        requestParameters,
        // callback function - render website
        function(error, response, content) {
            // TODO
        }
    );
};
////////////////////////////////////////////////////////////////////////////////


// DELETE LOAN ////////////////////////////////////////////////////////////
// loansManageDelete: delete loan with specified ID
module.exports.loansManageDelete = function(req, res) {
    
    var idUser = req.params.idUser;                          // get needed parameters of user from url
    var idLoan = req.params.idLoan;
    var path = '/api/users/' + idUser + '/loans/' + idLoan;  // Get path for API call.
    
    var requestParameters = {                                // Set request parameters.
        url: apiParameters.server + path,
        method: 'DELETE',
        json: {},
    };
    
    request(                                                 // Perform request.
        requestParameters,
        // callback function - show website
        function(error, response, content) {
            // showGenericDone(req, res, content);
        }
    );
};
/////////////////////////////////////////////////////////////////////////



// UPDATE LOAN STATUS ///////////////////////////////////////////////////

// loansManageUpdate: update loan with specified ID.
module.exports.loansManageUpdate = function(req, res) {
    
    var dataInBody = {                  // Get request body.
      status : req.body.status
    };
    
    var idUser = req.params.idUser;     // get parameters from path
    var idLoan = req.params.idLoan;
    var path = '/api/users/' + idUser + '/loans/' + idLoan;  // Get path for API call.
    
    // Set request parameters.
    var requestParameters = {
        url: apiParameters.server + path,
        method: 'PUT',
        json: dataInBody,
    };
                                        // Perform request.
    request(
        requestParameters,
        // callback function - show website
        function(error, response, content) {
            // TODO
        }
    );
};

// showLoansPage: show loans page.
var showLoansPage = function(req, res, content) {
    res.render('loans', content);
};

/////////////////////////////////////////////////////////////////////




// RENDER PATCHNOTES PAGE ///////////////////////////////////////////

// index is the function exposed by this module. It displays the index page.
module.exports.patchnotes = function(req, res) {
    res.render('patchnotes', {});
};

/////////////////////////////////////////////////////////////////////




// RENDER SIGNUP PAGE ///////////////////////////////////////////////

// index is the function exposed by this module. It displays the index page.
module.exports.signup = function(req, res) {
    // Get user parameter from path.
    res.render('signup', {});
};

/////////////////////////////////////////////////////////////////////

// SIGNUP FROM SUBMIT ///////////////////////////////////////////////

// signupSubmit: submit signup info.
module.exports.signupSubmit = function(req, res) {
    var path = '/api/users';            // Get path to API.
    
    // Get gender in form stored in database.
    req.body.gender = (req.body.gender == "Male" ? "m" : "f");

    var dataInBody = {                  // Get request body
      "name": req.body.name,
      "surname": req.body.surname,
      "username": req.body.username,
      "password": req.body.password,
      "email": req.body.email,
      "gender": req.body.gender
    };
    
    var requestParameters = {           // Set http request parameters.
        url: apiParameters.server + path,
        method: 'POST',
        json: dataInBody,
    };
    
    request(                            // Perform http request.
        requestParameters,
        // callback function - show website
        function(error, response, content) {
            // TODO
        }
    );
    
};

/////////////////////////////////////////////////////////////////////


// RENDER SIGNUP PAGE ///////////////////////////////////////////////

// showSignupPage: display signup page.
var showSignupPage = function(req, res, content) {
    res.render('signup', {});
};

/////////////////////////////////////////////////////////////////////






// RENDER DB PAGE ///////////////////////////////////////////////////

// db page
module.exports.db = function(req, res) {
    res.render('db', {});
};

/////////////////////////////////////////////////////////////////////





// DATABASE DROPPING ////////////////////////////////////////////////

// nukeDB: Remove all entries from database.
module.exports.nukeDB = function(req, res) {
    var path = '/api/nukeDB';       // Get path for API call.
    // Set request parameters.
    var requestParameters = {
        url: apiParameters.server + path,
        method: 'DELETE',
        json: {},
    };
    
    request(                    // Perform request.
        requestParameters,
        // callback function - show website
        function(error, response, content) {
            showDBPage(req, res, content);
        }
    );
};

/////////////////////////////////////////////////////////////////////




// DATABASE INITIALIZATION WITH TESTING DATA ////////////////////////

// nukeDB: Remove all entries from database.
module.exports.fillDB = function(req, res) {
    var path = '/api/fillDB';               // Get path for API call.
    var requestParameters = {               // Set request parameters.
        url: apiParameters.server + path,
        method: 'POST',
        json: {},
    };
    
    request(                                // Perform request.
        requestParameters,
        // callback function - render website
        function(error, response, content) {
            showDBPage(req, res, content);
        }
    );
};

var showDBPage = function(req, res, content) {
    res.render('db', {});
};

/////////////////////////////////////////////////////////////////////