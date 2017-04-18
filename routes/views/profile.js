'use strict';

/**
 * (Site name here)
 * Developed by Engagement Lab, 2016
 * ==============
 * Index page view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class Index
 * @author 
 *
 * ==========
 */
var keystone = require('keystone'),
    appRoot = require('app-root-path'),
    Index = keystone.list('Index'),
    Player = keystone.list('Player'),
    Category = keystone.list('Category'),
    randomstring = require('randomstring'),
    GameSession = keystone.list('GameSession'),
    GameConfig = keystone.list('GameConfig'),
    _ = require('underscore');

var GameManager = require(appRoot + '/lib/GameManager'),
    Session = require(appRoot + '/lib/SessionManager');


exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.gameId = 'TEST';

    // locals.viewType = 'group';
    locals.section = 'player';
// 
    view.on('init', function(next) {

        var queryPlayer = Player.model.findOne({ 'id': req.params.id }, {}, {});

        queryPlayer.exec(function (err, player) {


            
            locals.player = player;
            
            next(err);
            
        });


    });


  // Render the view
    view.render('game');

};




