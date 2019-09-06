var express = require('express');
var router = express.Router();
var getChat = require('./../data/data');
var moment = require('moment');

var state = getChat();

router.route('/')
    .get((req, res) => {
        // return state
        res.json(state);
    })
    .post((req, res) => {
        // accept a single new post
        const message = req.body.message;
        const ts = req.body.ts;
        const tsFromNow = moment.unix(ts).fromNow();
        const tsFormatted = moment.unix(ts).format("MMM D, Y");

        const newMessage = {
            "message": message,
            "ts": ts
        };

        const response = {
            "message": message,
            "ts": ts,
            "tsFromNow": tsFromNow,
            "tsFormatted": tsFormatted
        };

        state.posts.push(newMessage);

        res.json(response);
    });

module.exports = router;
