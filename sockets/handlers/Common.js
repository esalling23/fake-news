/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Common game socket handler.
 *
 * @class sockets/handlers
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

var Common = function (nsp, socket) {
    var currentSpace = nsp,
        currentSocket = socket, 
        appRoot = require('app-root-path')
        Session = require(appRoot + '/lib/SessionManager');

    // Expose handler methods for events
    this.handler = {

        'game:tutorial': function(package) {

            Session.Get(package.gameId).
            StartTutorial(currentSpace);
            
        },


        'game:start': function(package) {

            Session.Get(package).
            StartGame(currentSpace);

        },

        'game:newArticle': function(package) {

            Session.Get(package).
            NewArticle(currentSpace);

        },

        'game:next_round': function(package) {

            Session.Get(package.gameId).
            AdvanceRound(currentSpace);

        },

        'game:show_survey': function(package) {

            Session.Get(package.gameId).
            DisplaySurvey(currentSpace);

        },

        'send:vegans': function(package) {

            Session.Get(package.gameId).
            Share(package.article, 'vegans');

        },

        'send:meaties': function(package) {

            Session.Get(package.gameId).
            Share(package.article, 'meaties');

        },

        'comment:remove': function(package) {

            Session.Get(package).
            CommentUpdate(currentSpace);

        },

        /* Pauses all game cooldowns (debugging only) */
        'debug:pause': function(package) {

            Session.Get(package.gameId).
            PauseResumeCooldown();

        }
    
    };
}

module.exports = Common;