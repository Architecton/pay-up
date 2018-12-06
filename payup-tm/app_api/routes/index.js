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
router.post('/lokacije/:idLokacije/komentarji', ctrlLoans.komentarjiKreiraj);
router.get('/lokacije/:idLokacije/komentarji/:idKomentarja', ctrlLoans.komentarjiPreberiIzbranega);
router.put('/lokacije/:idLokacije/komentarji/:idKomentarja', ctrlLoans.komentarjiPosodobiIzbranega);
router.delete('/lokacije/:idLokacije/komentarji/:idKomentarja', ctrlLoans.komentarjiIzbrisiIzbranega);


// TODO: controllers for working with contacts

module.exports = router;