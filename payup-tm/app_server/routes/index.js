var express = require('express');
var router = express.Router();
var ctrlApp = require('../controllers/appctrl');

// Get Angular app
router.get('/', ctrlApp.angularApp);

// expose router as module
module.exports = router;