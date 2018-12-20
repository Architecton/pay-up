var express = require('express');
var router = express.Router();

// git checkout -b API_contacts_dbg API
// git checkout -b API_users_dbg API
// git checkout -b API_loans_dbg API

// controller modules
var ctrlUsers = require('../controllers/users');
var ctrlLoans = require('../controllers/loans');
var ctrlContacts = require('../controllers/contacts');
var ctrlAuthentication = require('../controllers/authentication');

// Controlers for working with users.
router.get('/users', ctrlUsers.userGetAll);


// AUXILIARY FUNCTIONS

// TODO CHANGE TO DELETE AND POST


router.post('/fillDB', ctrlUsers.fillDB);                                                   // TESTED (13.12.2018)
router.delete('/nukeDB', ctrlUsers.nukeDB);                                                 // TESTED (13.12.2018)
router.delete('/nukeDBindexes', ctrlUsers.nukeDBindexes);                                   // TESTED (13.12.2018)


// Controlers for working with users
router.post('/users', ctrlUsers.userCreate);                                                // TESTED (13.12.2018)
router.get('/users/:idUser', ctrlUsers.userGetSelected);                                    // TESTED (13.12.2018)
router.delete('/users/:idUser', ctrlUsers.userDeleteSelected);                              // TESTED (13.12.2018)
router.put('/users/:idUser/saveSettings', ctrlUsers.userSaveSettings);                      // TESTED (20.12.2018)
// TODO
// router.post('/users/:idUser/uploadAvatar', ctrlUsers.userUploadAvatar);


// Controllers for working with loans.
router.get('/loans', ctrlLoans.loanGetAll);                                                 // TESTED (20.12.2018)
router.post('/users/:idUser/loans', ctrlLoans.loanCreate);                                  // TESTED (20.12.2018)
router.get('/users/:idUser/loans', ctrlLoans.loanGetUsersLoans);                            // TESTED (20.12.2018)
router.get('/users/:idUser/loans/:idLoan', ctrlLoans.loanGetSelected);                      // TESTED (20.12.2018)
router.put('/users/:idUser/loans/:idLoan', ctrlLoans.loanUpdateSelected);                   // TESTED (20.12.2018)
router.delete('/users/:idUser/loans/:idLoan', ctrlLoans.loanDeleteSelected);                // TESTED (20.12.2018)


// Controlers for working with contacts.
router.get('/contacts', ctrlContacts.contactGetAll);                                        // TESTED (12.12.2018)
router.get('/users/:idUser/contacts', ctrlContacts.contactGetUsersContacts);                // TESTED (12.12.2018)
router.post('/users/:idUser/contacts', ctrlContacts.contactCreate);                         // TESTED (12.12.2018)
router.get('/users/:idUser/contacts/:idContact', ctrlContacts.contactGetSelected);          // TESTED (12.12.2018)
router.put('/users/:idUser/contacts/:idContact', ctrlContacts.contactUpdateSelected);       // TESTED (12.12.2018)
router.delete('/users/:idUser/contacts/:idContact', ctrlContacts.contactDeleteSelected);    // TESTED (12.12.2018)


// Controllers for authentication
router.post('/registracija', ctrlAuthentication.authSignUp);
router.post('/prijava', ctrlAuthentication.authLogIn);


// Expose router as module.
module.exports = router;