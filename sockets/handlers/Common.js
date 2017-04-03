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

        'game:newEvent': function(package) {

            Session.Get(package).
            NewEvent(currentSpace);

        },

        'game:comments': function(package) {

            Session.Get(package).
            Comments(currentSpace);

        },

        'game:next_round': function(package) {

            Session.Get(package.gameId).
            AdvanceRound(currentSpace);

        },

        'comment:update': function(package) {

            Session.Get(package.gameId).
            CommentUpdate(currentSpace, package.comment);

        },

        'comments:landed': function(package) {

            Session.Get(package.gameId).
            CheckComments(currentSpace, package.comment);

        },

        'comments:end': function(package) {

            Session.Get(package.gameId).
            EventScore(currentSpace);

        },

        /* Pauses all game cooldowns (debugging only) */
        'debug:pause': function(package) {

            Session.Get(package.gameId).
            PauseResumeCooldown();

        }
    
    };
}

module.exports = Common;