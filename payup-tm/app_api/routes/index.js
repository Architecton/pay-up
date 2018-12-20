var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();

var authentication = jwt({
    secret: process.env.JWT_PASSWORD,
    userProperty: 'payload'
});

// controller modules
var ctrlUsers = require('../controllers/users');
var ctrlLoans = require('../controllers/loans');
var ctrlContacts = require('../controllers/contacts');
var ctrlAuthentication = require('../controllers/authentication');


router.post('/fillDB', authentication, ctrlUsers.fillDB);                                                   // TESTED (13.12.2018)
router.delete('/nukeDB', authentication, ctrlUsers.nukeDB);                                                 // TESTED (13.12.2018)
router.delete('/nukeDBindexes', authentication, ctrlUsers.nukeDBindexes);                                   // TESTED (13.12.2018)


// Controlers for working with users
router.get('/users', authentication, ctrlUsers.userGetAll);
router.get('/users/:idUser', authentication, ctrlUsers.userGetSelected);                                    // TESTED (13.12.2018)
router.delete('/users/:idUser', authentication, ctrlUsers.userDeleteSelected);                              // TESTED (13.12.2018)
router.put('/users/:idUser/saveSettings', authentication, ctrlUsers.userSaveSettings);                      // TESTED (20.12.2018)
// router.get('/users/:idUser/messages', ctrlUsers.userGetMessages);
// router.put('/users/:idUser/messages/:idMessage', ctrlUsers.userSetMessageStatus);
// router.delete('/users/:idUser/messages', ctrlUsers.userDeleteAllMessages());
// TODO
// router.post('/users/:idUser/uploadAvatar', ctrlUsers.userUploadAvatar);


// Controllers for working with loans.
router.get('/loans', authentication, ctrlLoans.loanGetAll);                                                 // TESTED (20.12.2018)
router.post('/users/:idUser/loans', authentication, ctrlLoans.loanCreate);                                  // TESTED (20.12.2018)
router.get('/users/:idUser/loans', authentication, ctrlLoans.loanGetUsersLoans);                            // TESTED (20.12.2018)
router.get('/users/:idUser/loans/:idLoan', authentication, ctrlLoans.loanGetSelected);                      // TESTED (20.12.2018)
router.put('/users/:idUser/loans/:idLoan', authentication, ctrlLoans.loanUpdateSelected);                   // TESTED (20.12.2018)
router.delete('/users/:idUser/loans/:idLoan', authentication, ctrlLoans.loanDeleteSelected);                // TESTED (20.12.2018)


// Controlers for working with contacts.
router.get('/contacts', authentication, ctrlContacts.contactGetAll);                                        // TESTED (12.12.2018)
router.get('/users/:idUser/contacts', authentication, ctrlContacts.contactGetUsersContacts);                // TESTED (12.12.2018)
router.post('/users/:idUser/contacts', authentication, ctrlContacts.contactCreate);                         // TESTED (12.12.2018)
router.get('/users/:idUser/contacts/:idContact', authentication, ctrlContacts.contactGetSelected);          // TESTED (12.12.2018)
router.put('/users/:idUser/contacts/:idContact', authentication, ctrlContacts.contactUpdateSelected);       // TESTED (12.12.2018)
router.delete('/users/:idUser/contacts/:idContact', authentication, ctrlContacts.contactDeleteSelected);    // TESTED (12.12.2018)


// Controllers for authentication
router.post('/users', ctrlAuthentication.authSignUp);
router.post('/users/login', ctrlAuthentication.authLogIn);


// Expose router as module.
module.exports = router;