var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');


// HOME
router.get('/', ctrlMain.index);

// COMING SOON
router.get('/comingSoon', ctrlMain.comingSoon);

// CONTACTS
router.get('/contacts/:idUser', ctrlMain.contacts);                     // TESTED (12.12.2018)
router.post('/contacts/:idUser', ctrlMain.contactCreate);               // TESTED (12.12.2018)
router.put('/contacts/:idUser/:idContact', ctrlMain.contactAddNotes);   // TESTED (12.12.2018)
router.delete('/contacts/:idUser/:idContact', ctrlMain.contactDelete);  // TESTED (12.12.2018)

// DASHBOARD
router.get('/dashboard/:idUser', ctrlMain.dashboard);

// LOANS
router.get('/loans/:idUser', ctrlMain.loans);
router.post('/loans/:idUser', ctrlMain.loansManageCreate);
router.delete('/loans/:idUser/:idLoan', ctrlMain.loansManageDelete);
router.put('/loans/:idUser/:idLoan', ctrlMain.loansManageUpdate);

// SIGNUP
router.get('/signup', ctrlMain.signup);                                 // TESTED (13.12.2018)
router.post('/signup', ctrlMain.signupSubmit);                          // TESTED (13.12.2018)

// PATCH NOTES
router.get('/patchnotes', ctrlMain.patchnotes);

// DB 
router.get('/db', ctrlMain.db);
router.delete('/db', ctrlMain.nukeDB);
router.post('/db', ctrlMain.fillDB);

// expose router as module
module.exports = router;