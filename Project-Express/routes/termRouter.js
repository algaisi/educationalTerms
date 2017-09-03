var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Terms = require('../models/terms');
var verify = require('./verify');

var termRouter = express.Router();
termRouter.use(bodyParser.json());

termRouter.route('/')
.get(function (req, res, next) {
    Terms.find(req.query)
        .populate('comments.postedBy')
        .exec(function (err, term) {
        if (err) next(err);
        res.json(term);
    });
})

.post(verify.verifyOrdinaryUser, verify.verifyExpert, function (req, res, next) {
    Terms.create(req.body, function (err, term) {
        if (err) next(err);
        console.log('Term created!');
        var id = term._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the term with id: ' + id);
    });
})

.delete(verify.verifyOrdinaryUser, verify.verifyAdministrators, function (req, res, next) {
    Terms.remove({}, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});

termRouter.route('/:termId')
.get(function (req, res, next) {
    Terms.findById(req.params.termId)
        .populate('comments.postedBy')
        .exec(function (err, term) {
        if (err) next(err);
        res.json(term);
    });
})

.put(verify.verifyOrdinaryUser, verify.verifyExpert, function (req, res, next) {
    Terms.findByIdAndUpdate(req.params.termId, {
        $set: req.body
    }, {
        new: true
    }, function (err, term) {
        if (err) next(err);
        res.json(term);
    });
})

.delete(verify.verifyOrdinaryUser, verify.verifyAdministrators, function (req, res, next) {
        Terms.findByIdAndRemove(req.params.termId, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});

termRouter.route('/:termId/comments')


.get(function (req, res, next) {
    Terms.findById(req.params.termId)
        .populate('comments.postedBy')
        .exec(function (err, term) {
        if (err) next(err);
        res.json(term.comments);
    });
})

.post(verify.verifyOrdinaryUser, function (req, res, next) {
    Terms.findById(req.params.termId, function (err, term) {
        if (err) next(err);
        req.body.postedBy = req.decoded._id;
        term.comments.push(req.body);
        term.save(function (err, term) {
            if (err) next(err);
            console.log('Updated Comments!');
            res.json(term);
        });
    });
})

.delete(verify.verifyOrdinaryUser, verify.verifyAdministrators, function (req, res, next) {
    Terms.findById(req.params.termId, function (err, term) {
        if (err) next(err);
        for (var i = (term.comments.length - 1); i >= 0; i--) {
            term.comments.id(term.comments[i]._id).remove();
        }
        term.save(function (err, result) {
            if (err) next(err);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all comments!');
        });
    });
});

termRouter.route('/:termId/comments/:commentId')
.get(function (req, res, next) {
    Terms.findById(req.params.termId)
        .populate('comments.postedBy')
        .exec(function (err, term) {
        if (err) next(err);
        res.json(term.comments.id(req.params.commentId));
    });
})

.put(verify.verifyOrdinaryUser, function (req, res, next) {
    Terms.findById(req.params.termId, function (err, term) {
        if (err) next(err);
        term.comments.id(req.params.commentId).remove();
        req.body.postedBy = req.decoded._id;
        term.comments.push(req.body);
        term.save(function (err, term) {
            if (err) next(err);
            console.log('Updated Comments!');
            res.json(term);
        });
    });
})

.delete(verify.verifyOrdinaryUser, verify.verifyAdministrators, function (req, res, next) {
    Terms.findById(req.params.termId, function (err, term) {
        if (term.comments.id(req.params.commentId).postedBy != req.decoded._id) {
            var err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
        term.comments.id(req.params.commentId).remove();
        term.save(function (err, resp) {
            if (err) next(err);
            res.json(resp);
        });
    });
});

module.exports = termRouter;