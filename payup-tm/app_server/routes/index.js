var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');


// GET REQUEST HANDLER FOR ALL PAGE
/* GET home page. */
router.get('/', ctrlMain.index);

/* similar for other pages */
router.get('/comingSoon', ctrlMain.comingSoon);

// CONTACTS ** TESTED **
router.get('/contacts/:idUser', ctrlMain.contacts);
router.get('/contacts/:idUser/:idContact', ctrlMain.contactById);
router.post('/contacts/:idUser', ctrlMain.contactCreate);
router.put('/contacts/:idUser/:idContact', ctrlMain.contactAddNotes);


// DASHBOARD **
router.get('/dashboard/:idUser', ctrlMain.dashboard);


// LOANS
router.get('/loans/:idUser', ctrlMain.loans);
router.post('/loans/:idUser', ctrlMain.loansManageCreate);
router.delete('/loans/:idUser/:idLoan', ctrlMain.loansManageDelete);
router.put('/loans/:idUser/:idLoan', ctrlMain.loansManageUpdate);


// SIGNUP 
router.get('/signup', ctrlMain.signup);
router.post('/signup', ctrlMain.signupSubmit);


// PATCH NOTES
router.get('/patchnotes', ctrlMain.patchnotes);

    
// DB
router.get('/db', ctrlMain.db);
router.delete('/db', ctrlMain.nukeDB);
router.post('/db', ctrlMain.fillDB);

// expose router as module
module.exports = router;