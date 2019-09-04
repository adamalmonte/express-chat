var express = require('express');
var router = express.Router();
var getChat = require('./../data/data');

var state = getChat();

router.route('/')
    .get((req, res) => {
        res.json(state);
    })
    .post((req, res) => {
        //accept a single new post
    });

module.exports = router;
