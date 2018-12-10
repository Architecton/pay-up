
var request = require('request');
var apiParameters = {
  server: 'https://sp-projekt2-excogitator.c9users.io'
};


// showGenericDone: show generic done
var showGenericDone = function(req, res, content) {
    res.render('done', {});
};


// HOME PAGE ////////////////////////////////////////////////////////////

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
    var idUser = req.params.idUser;
    var path = '/api/users/' + idUser + '/contacts';
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
            content = {"contacts" : content};
            showContactsPage(req, res, content);
        }
    );
};
// contactsCreate: contacts page controller - create new contact.
module.exports.contactCreate = function(req, res) {
    // Get path to API.
    var idUser = req.params.idUser;
    var path = '/api/users/' + idUser + '/contacts';
    
    // Get request body
    var dataInBody = {
      name: req.body.name,
      surname: req.body.surname,
      username: req.body.username,
      email: req.body.email
    };
    
    // Set request parameters.
    var requestParameters = {
        url: apiParameters.server + path,
        method: 'POST',
        json: dataInBody,
    };
    
    // Perform request.
    request(
        requestParameters,
        // callback function - show website
        function(error, response, content) {
            showGenericDone(req, res, content);
        }
    );
};

// contacts: contacts page controller - edit contact notes.
module.exports.contactAddNotes = function(req, res) {
    
    // Get path to API.
    var idUser = req.params.idUser;
    var idContact = req.params.idContact;
    var path = '/api/users/' + idUser + '/contacts/' + idContact;
    // Set request parameters.
    
    // Get request body
    var dataInBody = {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      notes: req.body.notes
    };
    
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
            showGenericDone(req, res, content);
        }
    );
};

// contacts: contacts page controller.
module.exports.contactById = function(req, res) {
    // Get user id and contact id from path parameters.
    var idUser = req.params.idUser;
    var idContact = req.params.idContact;
    // Get path for API.
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
            showGenericDone(req, res, content);
        }
    );
};

// showContactsPage: show contacts page
var showContactsPage = function(req, res, content) {
    res.render('contacts', content);
};

/////////////////////////////////////////////////////////////////////////



// DASHBOARD PAGE ///////////////////////////////////////////////////////

// index is the function exposed by this module. It displays the index page.
module.exports.dashboard = function(req, res) {
    // Get needed parameters from path.
    var idUser = req.params.idUser;
    var path = '/api/users/' + idUser + '/loans';
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



// LOANS PAGE ///////////////////////////////////////////////////////////

// loans: 
module.exports.loans = function(req, res) {
    
    // Get needed parameters from path.
    var idUser = req.params.idUser;
    var path = '/api/users/' + idUser + '/loans';
    
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
            content = {loans: content};
            showLoansPage(req, res, content);
        }
    );
};


module.exports.loansManageCreate = function(req, res) {
    
    var idUser = req.params.idUser;
    var path = '/api/users/' + idUser + '/loans';
    
    var dataInBody = {
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
    
    // Set request parameters.
    var requestParameters = {
        url: apiParameters.server + path,
        method: 'POST',
        json: dataInBody,
    };
    // Perform request.
    request(
        requestParameters,
        // callback function - show website
        function(error, response, content) {
            showGenericDone(req, res, content);
        }
    );
};

// loansManageDelete: delete loan with specified ID
module.exports.loansManageDelete = function(req, res) {
    
    // get parameters of user from url
    var idUser = req.params.idUser;
    var idLoan = req.params.idLoan;
    var path = '/api/users/' + idUser + '/loans/' + idLoan;
    
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
            showGenericDone(req, res, content);
        }
    );
};


// loansManageUpdate: update loan with specified ID.
module.exports.loansManageUpdate = function(req, res) {
    
    var dataInBody = {
      status : req.body.status
    };
    
    // get needed parameters from path
    var idUser = req.params.idUser;
    var idLoan = req.params.idLoan;
    var path = '/api/users/' + idUser + '/loans/' + idLoan;
    
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
            showGenericDone(req, res, content);
        }
    );
};

// showLoansPage: show loans page.
var showLoansPage = function(req, res, content) {
    res.render('loans', content);
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
    // Get user parameter from path.
    res.render('signup', {title: 'Signup'});
};


// signupSubmit: submit signup info.
module.exports.signupSubmit = function(req, res) {
    // Get path to API.
    var path = '/api/users';
    
    //console.log("PASS" + dataInBody.password);
    
    // validise gender.
    req.body.gender = (req.body.gender == "Male" ? "m" : "f");

    // Get data in body of request.
    var dataInBody = {
      "name": req.body.name,
      "surname": req.body.surname,
      "username": req.body.username,
      "password": req.body['password[]'][0],
      "email": req.body.email,
      "gender": req.body.gender
    };
    
    // Set request parameters.
    var requestParameters = {
        url: apiParameters.server + path,
        method: 'POST',
        json: dataInBody,
    };
    // Perform request.
    request(
        requestParameters,
        // callback function - show website
        function(error, response, content) {
            showGenericDone(req, res, content);
        }
    );
    
    // Get path of API call to send mail.
    path = '/api/' + 'je.vivod@gmail.com' + '/sendMail';
    // Set request parameters.
    requestParameters = {
        url: apiParameters.server + path,
        method: 'GET',
        json: {},
    };
    // Perform request.
    request(
        requestParameters,
        // callback function - show website
        function(error, response, content) {
            console.log("CALLBACK")
            showGenericDone(req, res, {});
        }
    );
};

// showSignupPage: display signup page.
var showSignupPage = function(req, res, content) {
    res.render('signup', {title: 'Signup'});
};

/////////////////////////////////////////////////////////////////////



// DATABASE INITIALIZATION AND DROPPING /////////////////////////////

// db page
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
        method: 'DELETE',
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
        method: 'POST',
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