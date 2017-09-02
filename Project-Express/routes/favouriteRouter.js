var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Favourite = require('../models/favourites');
var Dish = require('../models/terms');
var verify = require('./verify');

var favouriteRouter = express.Router();
favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
    .get(verify.verifyOrdinaryUser, function (req, res, next) {
        Favourite.find({'postedBy': req.decoded._id})
            .populate('postedBy')
            .populate('terms')
            .exec(function (err, favourites) {
                if (err) return err;
                res.json(favourites);
            });
    })
    .post(verify.verifyOrdinaryUser, function (req, res, next) {
        Favourite.find({'postedBy': req.decoded._id})
            .exec(function (err, favourites) {
                if (err) next(err);
                req.body.postedBy = req.decoded._id;
                if (favourites.length) {
                    var favouriteAlreadyExist = false;
                    if (favourites[0].terms.length) {
                        for (var i = (favourites[0].terms.length - 1); i >= 0; i--) {
                            favouriteAlreadyExist = favourites[0].terms[i] == req.body._id;
                            if (favouriteAlreadyExist) break;
                        }
                    }
                    if (!favouriteAlreadyExist) {
                        favourites[0].terms.push(req.body._id);
                        favourites[0].save(function (err, favourite) {
                            if (err) next(err);
                            res.json(favourite);
                        });
                    } else {
                        console.log('Setup!');
                        res.json(favourites);
                    }

                } else {
                    Favourite.create({postedBy: req.body.postedBy}, function (err, favourite) {
                        if (err) next(err);
                        favourite.terms.push(req.body._id);
                        favourite.save(function (err, favourite) {
                            if (err) next(err);
                            res.json(favourite);
                        });
                    })
                }
            });
    })
    .delete(verify.verifyOrdinaryUser, function (req, res, next) {
        Favourite.remove({'postedBy': req.decoded._id}, function (err, resp) {
            if (err) next(err);
            res.json(resp);
        })
    });

favouriteRouter.route('/:termId')
    
    .delete(verify.verifyOrdinaryUser, function (req, res, next) {
        Favourite.find({'postedBy': req.decoded._id}, function (err, favourites) {
            if (err) return err;
            var favourite = favourites ? favourites[0] : null;
            if (favourite) {
                for (var i = (favourite.terms.length - 1); i >= 0; i--) {
                    if (favourite.terms[i] == req.params.termId) {
                        favourite.terms.remove(req.params.termId);
                    }
                }
                favourite.save(function (err, favourite) {
                    if (err) next(err);
                    res.json(favourite);
                });
            } else {
                res.json(favourite);
            }
        });
    });
module.exports = favouriteRouter;
