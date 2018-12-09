var express = require('express');
var router = express.Router();

// git checkout -b API_contacts_dbg API
// git checkout -b API_users_dbg API
// git checkout -b API_loans_dbg API

// controller modules
var ctrlUsers = require('../controllers/users');
var ctrlLoans = require('../controllers/loans');
var ctrlContacts = require('../controllers/contacts');

// Controlers for working with users.
router.get('/users', ctrlUsers.userGetAll);


// AUXILIARY FUNCTIONS
router.post('/fillDB', ctrlUsers.fillDB);
router.delete('/nukeDB', ctrlUsers.nukeDB);
router.delete('/nukeDBindexes', ctrlUsers.nukeDBindexes);
router.get('/:email/sendMail', ctrlUsers.sendConfirmationMail);


// Controlers for working with users
router.post('/users', ctrlUsers.userCreate);
router.get('/users/:idUser', ctrlUsers.userGetSelected);
// router.put('/users/:idUser', ctrlUsers.userUpdateSelected); (TODO: implement if time - not necessary for application)
router.delete('/users/:idUser', ctrlUsers.userDeleteSelected);



// Controllers for working with loans.
router.get('/loans', ctrlLoans.loanGetAll);
router.post('/users/:idUser/loans', ctrlLoans.loanCreate);
router.get('/users/:idUser/loans', ctrlLoans.loanGetUsersLoans);
router.get('/users/:idUser/loans/:idLoan', ctrlLoans.loanGetSelected);
router.put('/users/:idUser/loans/:idLoan', ctrlLoans.loanUpdateSelected);
router.delete('/users/:idUser/loans/:idLoan', ctrlLoans.loanDeleteSelected);



// Controlers for working with contacts.
router.get('/contacts', ctrlContacts.contactGetAll);
router.get('/users/:idUser/contacts', ctrlContacts.contactGetUsersContacts);
router.post('/users/:idUser/contacts', ctrlContacts.contactCreate);
router.get('/users/:idUser/contacts/:idContact', ctrlContacts.contactGetSelected);
router.put('/users/:idUser/contacts/:idContact', ctrlContacts.contactUpdateSelected);
router.delete('/users/:idUser/contacts/:idContact', ctrlContacts.contactDeleteSelected);


// Expose router as module.
module.exports = router;