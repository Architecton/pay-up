var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');


// GET REQUEST HANDLER FOR ALL PAGE
/* GET home page. */
router.get('/', ctrlMain.index);

/* similar for other pages */
router.get('/comingSoon', ctrlMain.comingSoon);
router.get('/contacts', ctrlMain.contacts);
router.get('/dashboard', ctrlMain.dashboard);
router.get('/loans', ctrlMain.loans);
router.get('/patchnotes', ctrlMain.patchnotes);
router.get('/signup', ctrlMain.signup);
router.get('/db', ctrlMain.db);
router.get('/db/nukeDB', ctrlMain.nukeDB);
router.get('/db/fillDB', ctrlMain.fillDB);

// expose router as module
module.exports = router;