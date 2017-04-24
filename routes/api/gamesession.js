'use strict';

/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Home page view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class index
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

var keystone = require('keystone'),
    async = require('async'),
    appRoot = require('app-root-path');
    
var Game = require(appRoot + '/lib/GameManager'),
	GameSession = keystone.list('GameSession'),
    Session = require(appRoot + '/lib/SessionManager');

/**
 * Create a GameSession
 */
exports.create = function(req, res) {

    var data;

    data = req.body;

    console.log('creating the game')

    var session = new GameSession.model();

    // Save this session to memory for faster retrieval (deleted when game ends)
    Session.Create('TEST', new Game(session));

    res.send('created');
        
};
