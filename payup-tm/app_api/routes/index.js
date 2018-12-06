var express = require('express');
var router = express.Router();


// Controlers for 
var ctrlUsers = require('../controllers/users');
var ctrlLoans = require('../controllers/loans');


// Controlers for working with users.
router.get('/users', ctrlUsers.userGetAll);
router.post('/users', ctrlUsers.userCreate);
router.get('/users/:idUser', ctrlUsers.userGetSelected);
router.put('/users/:idUser', ctrlUsers.userUpdateSelected);
router.delete('/users/:idUser', ctrlUsers.userDeleteSelected);

// Controlers for working with loans
router.get('/loans', ctrlLoans.loanGetAll);
router.post('/loans', ctrlLoans.loanCreate);
router.get('/loans/:idLoan', ctrlLoans.loanGetSelected);
router.put('/loans/:idLoan', ctrlLoans.loanUpdateSelected);
router.delete('/loan/:idLoan', ctrlLoans.loanDeleteSelected);


// TODO: controllers for working with contacts

module.exports = router;