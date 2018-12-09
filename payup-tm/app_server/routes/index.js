var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');


// GET REQUEST HANDLER FOR ALL PAGE
/* GET home page. */
router.get('/', ctrlMain.index);

/* similar for other pages */
router.get('/comingSoon', ctrlMain.comingSoon);

// CONTACTS **
router.get('/contacts/:idUser', ctrlMain.contacts);
router.get('/user/:idUser/contacts/:idContact', ctrlMain.contactById);

// DASHBOARD **
router.get('/dashboard/:idUser', ctrlMain.dashboard);

// LOANS
router.get('/loans/:idUser', ctrlMain.loans);
router.get('/loans/:idUser/loans/:idLoan/delete', ctrlMain.loansManageCreate);
router.get('/loans/:idUser/loans/:idLoan/create', ctrlMain.loansManageDelete);
router.get('/loans/:idUser/loans/:idLoan/update', ctrlMain.loansManageUpdate);


// SIGNUP
router.get('/signup', ctrlMain.signup);
router.get('/signup/submit', ctrlMain.signupSubmit);

// PATCH NOTES
router.get('/patchnotes', ctrlMain.patchnotes);


// DB
router.get('/db', ctrlMain.db);
router.get('/db/nukeDB', ctrlMain.nukeDB);
router.get('/db/fillDB', ctrlMain.fillDB);

// expose router as module
module.exports = router;