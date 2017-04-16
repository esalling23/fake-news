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

        'game:newRound': function(package) {

            Session.Get(package).
            StartRound(currentSpace);

        },

        'game:newProfile': function(package) {

            Session.Get(package).
            NewProfile(currentSpace);

        },

        'game:newFeed': function(package) {

            Session.Get(package).
            NewFeed(currentSpace);

        },

        'game:comments': function(package) {

            Session.Get(package).
            Comments(currentSpace);

        },

        'post:reaction': function(package) {

            Session.Get(package.gameId).
            PostReaction(currentSpace, package.reaction);

        },

        'post:share': function(package) {

            Session.Get(package.gameId).
            CheckPost(currentSpace, package.data);

        },

        'comments:end': function(package) {

            Session.Get(package.gameId).
            ProfileScore(currentSpace);

        },

        /* Pauses all game cooldowns (debugging only) */
        'debug:pause': function(package) {

            Session.Get(package.gameId).
            PauseResumeCooldown();

        }
    
    };
}

module.exports = Common;