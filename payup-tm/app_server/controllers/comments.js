//var dataJSON = require('../models/comments.json');
var request = require('request');

var paramsApi = {
  server: 'http://localhost:' + process.env.PORT,
  apiCommentsURI: '/api/comments'
};
if (process.env.NODE_ENV === 'production') {
  paramsApi.server = 'https://drugo-ime238.herokuapp.com/';
  //paramsApi.apiCommentsURI = 'api/comments';
}

// return function
var listRender = function(req, res, content){
    /*Get rest api data*/
    var apiData = {comments: content};
    res.render('comments', apiData["comments"]);
}

//-----------------------------------------------------------//
var content = require('../models/comments.json');
/* GET home page */
module.exports.index = function(req, res) {
  listRender(req, res, content);
};