var express = require('express');
// Create a router.
var router = express.Router();
// loans controller
var ctrlLoans = require('../controllers/loans');
var ctrlUsers = require('../controllers/users');

/* GET home page. */
router.get('/', ctrlLoans.index);


// HTTP REQUEST HANDLERS

// Function that handles post requests to loans controller.
router.post('/loans', ctrlLoans.loansCreate);
// Function that handles get requests to loans controller.
router.get('/loans', ctrlLoans.index);

// Expose router as module.
module.exports = router;