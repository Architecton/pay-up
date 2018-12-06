// Router that routes to root page

var express = require('express');
var router = express.Router();

/* GET root page. */
router.get('/', function(req, res, next) {
    // render root
    res.render('index', { title: 'Express' });
});

// expose this router as module (sed in app.js)
module.exports = router;