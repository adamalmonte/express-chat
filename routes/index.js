var express = require('express');
var router = express.Router();
var getChat = require('./../data/data');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {data: getChat()});
});

module.exports = router;
