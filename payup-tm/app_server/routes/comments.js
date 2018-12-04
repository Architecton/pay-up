var express = require('express');
var router = express.Router();
var ctrlComments = require('../controllers/comments');

/* GET home page. */
router.get('/', ctrlComments.index);

module.exports = router;

