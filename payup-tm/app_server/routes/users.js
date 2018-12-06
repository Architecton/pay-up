// this router routes to /users

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// expose router as module (used in app.js)
module.exports = router;