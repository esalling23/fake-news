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
    Category = keystone.list('Category'),
    GameSession = keystone.list('GameSession'),
    _ = require('underscore');

var Game = require(appRoot + '/lib/GameManager'),
    Session = require(appRoot + '/lib/SessionManager');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'index';

    var session = new GameSession.model();

    // Save this session to memory for faster retrieval (deleted when game ends)
    Session.Create('TEST', new Game(session));

    view.on('init', function(next) {

        var queryIndex = Index.model.findOne({}, {}, {
            sort: {
                'createdAt': -1
            }
        });
        queryIndex.exec(function(err, resultIndex) {
            if (err) throw err;

            locals.index = resultIndex;
                
            next();

        });
    });

    // Render the view
    view.render('index');

};
