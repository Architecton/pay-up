var express = require('express');
var router = express.Router();
var ctrlLoans = require('../controllers/loans');

/* GET home page. */
router.get('/', ctrlLoans.index);

router.post('/loans', ctrlLoans.loansKreiraj);

module.exports = router;
