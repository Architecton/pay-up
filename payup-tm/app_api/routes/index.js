var express = require('express');
var router = express.Router();
var ctrlOther = require('../controllers/loans');

/* GET home page. */
router.get('/', ctrlOther.index);

module.exports = router;
