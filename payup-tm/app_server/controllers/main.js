// index is the function exposed by this module. It displays the index page.
module.exports.index = function(req, res) {
    /* Klic prevajanja PUG v html datoteko.
    Metoda render prejme kot prvi parameter ime predloge, 
    ki jo želimo uporabiti in v našem primeru referencira datoteko index.pug,
    drugi parameter pa je JavaScript objekt, kjer lahko opredelimo parametre
    pri generiranju HTML datoteke. */
    res.render('index', {title: 'Express'});
};