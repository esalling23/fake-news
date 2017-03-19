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
    Category = keystone.list('Category'),
    randomstring = require('randomstring'),
    GameSession = keystone.list('GameSession'),
    GameConfig = keystone.list('GameConfig'),
    Article = keystone.list('Article'),
    Comment = keystone.list('Comment'),
    _ = require('underscore');

var GameManager = require(appRoot + '/lib/GameManager'),
    Session = require(appRoot + '/lib/SessionManager');


exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.gameId = 'TEST';

    // locals.viewType = 'group';
    locals.section = 'game';


// 
    view.on('init', function(next) {

         var queryGame = GameConfig.model.findOne({
                                    'enabled':true
                                    // 'gameType':new RegExp('^'+locals.whichGame+'$', "i")
                                    });
         var queryArticles = Article.model.find({}, {}, {})
         .populate('thumbnails headlines');

         var queryComments = Comment.model.find({}, {}, {});

        // Get game config and articles
        queryArticles.exec(function (err, articles) { 

            locals.articles = articles;
            locals.thumbnails = articles.thumbnails;
            locals.headlines = articles.headlines;
            // locals.comments = articles.comments;

            queryGame.exec(function (err, game) {
                
                locals.game = game;
                
                next(err);
            });

        });

    });


  // Render the view
    view.render('game');

};




