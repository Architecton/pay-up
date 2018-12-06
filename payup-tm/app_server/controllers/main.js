// index is the function exposed by this module. It displays the index page.
module.exports.index = function(req, res) {
    res.render('index', {title: 'Express'});
};